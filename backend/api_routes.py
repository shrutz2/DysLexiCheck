from flask import Blueprint, request, jsonify
from database import create_user, get_user_history, get_all_results, get_user_by_name

# Create Blueprint for user/admin routes
api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/login', methods=['POST'])
def login_user():
    """Login user by name"""
    try:
        data = request.get_json()
        name = data.get('name')
        
        if not name:
            return jsonify({'error': 'Name is required'}), 400
        
        user = get_user_by_name(name)
        
        if user:
            return jsonify({
                'success': True,
                'user_id': user['id'],
                'name': user['name'],
                'age': user['age'],
                'grade': user['grade'],
                'message': 'Login successful'
            })
        else:
            return jsonify({'error': 'User not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/users', methods=['POST'])
def create_new_user():
    """Create a new user"""
    try:
        data = request.get_json()
        name = data.get('name')
        age = data.get('age')
        grade = data.get('grade')
        
        if not name or not age:
            return jsonify({'error': 'Name and age are required'}), 400
        
        user_id = create_user(name, age, grade)
        
        if user_id:
            return jsonify({
                'success': True,
                'user_id': user_id,
                'message': 'User created successfully'
            })
        else:
            return jsonify({'error': 'Failed to create user'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/users/<int:user_id>/history', methods=['GET'])
def get_history(user_id):
    """Get test history for a user"""
    try:
        history = get_user_history(user_id)
        return jsonify({
            'user_id': user_id,
            'test_count': len(history),
            'history': history
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/results', methods=['GET'])
def get_results():
    """Get all test results (admin endpoint)"""
    try:
        results = get_all_results()
        return jsonify({
            'total_results': len(results),
            'results': results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api_bp.route('/stats', methods=['GET'])
def get_stats():
    """Get overall statistics"""
    try:
        results = get_all_results()
        
        if not results:
            return jsonify({
                'total_tests': 0,
                'dyslexia_detected': 0,
                'non_dyslexia': 0
            })
        
        total_tests = len(results)
        dyslexia_count = sum(1 for r in results if 'dyslexia' in r.get('prediction', '').lower() and r.get('prediction') != 'non-dyslexia')
        
        # Test type breakdown
        test_types = {}
        for r in results:
            test_type = r.get('test_type', 'unknown')
            test_types[test_type] = test_types.get(test_type, 0) + 1
        
        return jsonify({
            'total_tests': total_tests,
            'dyslexia_detected': dyslexia_count,
            'non_dyslexia': total_tests - dyslexia_count,
            'detection_rate': round((dyslexia_count / total_tests * 100), 2) if total_tests > 0 else 0,
            'test_types': test_types
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
