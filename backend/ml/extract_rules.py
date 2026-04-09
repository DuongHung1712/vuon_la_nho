import json
import os

ipynb_path = r'D:\AI\Pipeline\kaggle_robust_pipeline.ipynb'
out_dir = r'd:\Fullstack\vuonlanho_project\vuonlanho\backend\ml'

with open(ipynb_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

for cell in nb.get('cells', []):
    if cell['cell_type'] == 'code':
        source = "".join(cell.get('source', []))
        if source.startswith('%%writefile /kaggle/working/rule_based_filters.py'):
            out_file = os.path.join(out_dir, 'rule_based_filters.py')
            code = source.split('\n', 1)[1] 
            with open(out_file, 'w', encoding='utf-8') as cf:
                cf.write(code)
            print("Extracted rule_based_filters.py")
        elif source.startswith('%%writefile /kaggle/working/post_processing.py'):
            out_file = os.path.join(out_dir, 'post_processing.py')
            code = source.split('\n', 1)[1]
            with open(out_file, 'w', encoding='utf-8') as cf:
                cf.write(code)
            print("Extracted post_processing.py")
