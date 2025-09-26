from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from PIL import Image
from textblob import TextBlob
import language_tool_python
import requests
import pandas as pd
import random
import speech_recognition as sr
import pyttsx3
import time
import eng_to_ipa as ipa
import tempfile

from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials

from abydos.phonetic import Soundex, Metaphone, Caverphone, NYSIIS

app = Flask(__name__, static_folder='../frontend/build')
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes with explicit configuration

# image to text API authentication
subscription_key_imagetotext = "1780f5636509411da43040b70b5d2e22"
endpoint_imagetotext = "https://prana-------------v.cognitiveservices.azure.com/"
computervision_client = ComputerVisionClient(
    endpoint_imagetotext, CognitiveServicesCredentials(subscription_key_imagetotext))

# text correction API authentication
api_key_textcorrection = "7aba4995897b4dcaa86c34ddb82a1ecf"
endpoint_textcorrection = "https://api.bing.microsoft.com/v7.0/SpellCheck"

# Initialize language tool with error handling
try:
    my_tool = language_tool_python.LanguageTool('en-US')
except Exception as e:
    print(f"Warning: Could not initialize LanguageTool: {e}")
    my_tool = None

def levenshtein(s1, s2):
    if len(s1) < len(s2):
        return levenshtein(s2, s1)

    # len(s1) >= len(s2)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            # j+1 instead of j since previous_row and current_row are one character longer
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1       # than s2
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

# method for extracting the text
def image_to_text(path):
    read_image = open(path, "rb")
    read_response = computervision_client.read_in_stream(read_image, raw=True)
    read_operation_location = read_response.headers["Operation-Location"]
    operation_id = read_operation_location.split("/")[-1]

    while True:
        read_result = computervision_client.get_read_result(operation_id)
        if read_result.status.lower() not in ['notstarted', 'running']:
            break
        time.sleep(5)

    text = []
    if read_result.status == OperationStatusCodes.succeeded:
        for text_result in read_result.analyze_result.read_results:
            for line in text_result.lines:
                text.append(line.text)

    return " ".join(text)

# method for finding the spelling accuracy
def spelling_accuracy(extracted_text):
    spell_corrected = TextBlob(extracted_text).correct()
    return ((len(extracted_text) - (levenshtein(extracted_text, str(spell_corrected))))/(len(extracted_text)+1))*100

# method for gramatical accuracy
def gramatical_accuracy(extracted_text):
    spell_corrected = TextBlob(extracted_text).correct()
    if my_tool is not None:
        correct_text = my_tool.correct(str(spell_corrected))
    else:
        # Fallback: use TextBlob for basic grammar correction
        correct_text = str(spell_corrected)
    extracted_text_set = set(str(spell_corrected).split(" "))
    correct_text_set = set(correct_text.split(" "))
    n = max(len(extracted_text_set - correct_text_set),
            len(correct_text_set - extracted_text_set))
    return ((len(str(spell_corrected)) - n)/(len(str(spell_corrected))+1))*100

# percentage of corrections
def percentage_of_corrections(extracted_text):
    data = {'text': extracted_text}
    params = {
        'mkt': 'en-us',
        'mode': 'proof'
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Ocp-Apim-Subscription-Key': api_key_textcorrection,
    }
    response = requests.post(endpoint_textcorrection,
                             headers=headers, params=params, data=data)
    json_response = response.json()
    return len(json_response['flaggedTokens'])/len(extracted_text.split(" "))*100

# percentage of phonetic accuracy
def percentage_of_phonetic_accuraccy(extracted_text):
    soundex = Soundex()
    metaphone = Metaphone()
    caverphone = Caverphone()
    nysiis = NYSIIS()
    spell_corrected = TextBlob(extracted_text).correct()

    extracted_text_list = extracted_text.split(" ")
    extracted_phonetics_soundex = [soundex.encode(
        string) for string in extracted_text_list]
    extracted_phonetics_metaphone = [metaphone.encode(
        string) for string in extracted_text_list]
    extracted_phonetics_caverphone = [caverphone.encode(
        string) for string in extracted_text_list]
    extracted_phonetics_nysiis = [nysiis.encode(
        string) for string in extracted_text_list]

    extracted_soundex_string = " ".join(extracted_phonetics_soundex)
    extracted_metaphone_string = " ".join(extracted_phonetics_metaphone)
    extracted_caverphone_string = " ".join(extracted_phonetics_caverphone)
    extracted_nysiis_string = " ".join(extracted_phonetics_nysiis)

    spell_corrected_list = str(spell_corrected).split(" ")
    spell_corrected_phonetics_soundex = [
        soundex.encode(string) for string in spell_corrected_list]
    spell_corrected_phonetics_metaphone = [
        metaphone.encode(string) for string in spell_corrected_list]
    spell_corrected_phonetics_caverphone = [
        caverphone.encode(string) for string in spell_corrected_list]
    spell_corrected_phonetics_nysiis = [nysiis.encode(
        string) for string in spell_corrected_list]

    spell_corrected_soundex_string = " ".join(
        spell_corrected_phonetics_soundex)
    spell_corrected_metaphone_string = " ".join(
        spell_corrected_phonetics_metaphone)
    spell_corrected_caverphone_string = " ".join(
        spell_corrected_phonetics_caverphone)
    spell_corrected_nysiis_string = " ".join(spell_corrected_phonetics_nysiis)

    soundex_score = (len(extracted_soundex_string)-(levenshtein(extracted_soundex_string,
                     spell_corrected_soundex_string)))/(len(extracted_soundex_string)+1)
    metaphone_score = (len(extracted_metaphone_string)-(levenshtein(extracted_metaphone_string,
                       spell_corrected_metaphone_string)))/(len(extracted_metaphone_string)+1)
    caverphone_score = (len(extracted_caverphone_string)-(levenshtein(extracted_caverphone_string,
                        spell_corrected_caverphone_string)))/(len(extracted_caverphone_string)+1)
    nysiis_score = (len(extracted_nysiis_string)-(levenshtein(extracted_nysiis_string,
                    spell_corrected_nysiis_string)))/(len(extracted_nysiis_string)+1)
    
    return ((0.5*caverphone_score + 0.2*soundex_score + 0.2*metaphone_score + 0.1 * nysiis_score))*100

def get_feature_array(path):
    feature_array = []
    extracted_text = image_to_text(path)
    feature_array.append(spelling_accuracy(extracted_text))
    feature_array.append(gramatical_accuracy(extracted_text))
    feature_array.append(percentage_of_corrections(extracted_text))
    feature_array.append(percentage_of_phonetic_accuraccy(extracted_text))
    return feature_array, extracted_text

def score(input):
    if input[0] <= 96.40350723266602:
        var0 = [0.0, 1.0]
    else:
        if input[1] <= 99.1046028137207:
            var0 = [0.0, 1.0]
        else:
            if input[2] <= 2.408450722694397:
                if input[2] <= 1.7936508059501648:
                    var0 = [1.0, 0.0]
                else:
                    var0 = [0.0, 1.0]
            else:
                var0 = [1.0, 0.0]
    return var0

def get_10_word_array(level):
    # Use absolute paths to data files
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "data")
    
    try:
        if (level == 1):
            file_path = os.path.join(data_dir, "intermediate_voc.csv")
            print(f"Loading file: {file_path}")
            voc = pd.read_csv(file_path)
            arr = voc.squeeze().to_numpy()
            selected_list = random.sample(list(arr), 10)
            return selected_list
        elif(level == 2):
            file_path = os.path.join(data_dir, "elementary_voc.csv")
            print(f"Loading file: {file_path}")
            voc = pd.read_csv(file_path)
            arr = voc.squeeze().to_numpy()
            selected_list = random.sample(list(arr), 10) 
            return selected_list
        else:
            return []
    except Exception as e:
        print(f"Error loading vocabulary file: {e}")
        # Return some default words if files can't be loaded
        return ["apple", "banana", "cat", "dog", "elephant", "fish", "giraffe", "house", "ice", "jacket"]

def check_pronounciation(str1, str2):
    s1 = ipa.convert(str1)
    s2 = ipa.convert(str2)
    return levenshtein(s1, s2)

# API Routes
@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Save the uploaded file temporarily
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    file.save(temp_file.name)
    temp_file.close()
    
    try:
        # Extract text from image and analyze
        feature_array, extracted_text = get_feature_array(temp_file.name)
        result = score(feature_array)
        
        # Return results
        return jsonify({
            'extracted_text': extracted_text,
            'spelling_accuracy': feature_array[0],
            'grammatical_accuracy': feature_array[1],
            'percentage_of_corrections': feature_array[2],
            'phonetic_accuracy': feature_array[3],
            'result': result[0] == 1
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        # Clean up the temporary file
        if os.path.exists(temp_file.name):
            os.unlink(temp_file.name)

@app.route('/api/get-words', methods=['GET'])
def get_words():
    level = request.args.get('level', default=1, type=int)
    words = get_10_word_array(level)
    return jsonify({'words': words})

@app.route('/api/check-pronunciation', methods=['POST'])
def check_pronunciation_api():
    data = request.json
    if not data or 'original' not in data or 'pronounced' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    original = data['original']
    pronounced = data['pronounced']
    
    inaccuracy = check_pronounciation(original, pronounced) / len(original)
    
    return jsonify({
        'inaccuracy': inaccuracy,
        'original_ipa': ipa.convert(original),
        'pronounced_ipa': ipa.convert(pronounced)
    })

@app.route('/api/check-dictation', methods=['POST'])
def check_dictation():
    data = request.json
    if not data or 'words' not in data or 'user_input' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    words = data['words']
    user_input = data['user_input']
    
    # Calculate accuracy
    accuracy = []
    for i in range(min(len(words), len(user_input))):
        if i < len(user_input):
            word_accuracy = 1 - (levenshtein(words[i], user_input[i]) / max(len(words[i]), 1))
            accuracy.append(word_accuracy)
    
    # Fill remaining with zeros if user provided fewer words
    while len(accuracy) < len(words):
        accuracy.append(0)
    
    return jsonify({
        'accuracy': accuracy,
        'overall_accuracy': sum(accuracy) / len(accuracy) if accuracy else 0
    })

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)