from flask import Flask, request, render_template, jsonify
import pandas as pd
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files provided'}), 400
    
    files = request.files.getlist('files[]')
    if not files or files[0].filename == '':
        return jsonify({'error': 'No files selected'}), 400

    dataframes = []
    for file in files:
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Read the file into a pandas DataFrame
            try:
                df = pd.read_csv(filepath)  # Assuming CSV files, modify as needed
                dataframes.append(df)
            except Exception as e:
                return jsonify({'error': f'Error processing {filename}: {str(e)}'}), 400
            finally:
                # Clean up the uploaded file
                os.remove(filepath)
    
    if dataframes:
        # Combine all dataframes
        combined_df = pd.concat(dataframes, ignore_index=True)
        
        # Perform some basic analytics
        analytics = {
            'total_rows': len(combined_df),
            'total_columns': len(combined_df.columns),
            'columns': combined_df.columns.tolist(),
            'summary': combined_df.describe().to_dict()
        }
        
        return jsonify(analytics)
    
    return jsonify({'error': 'No valid data processed'}), 400

if __name__ == '__main__':
    app.run(debug=True)
