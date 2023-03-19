import re
import json

def parse_questions(txt_file):
    with open(txt_file, 'r', encoding='utf-8') as f:
        content = f.read()
    pattern = r'\d+\.(.*?)\n(.*?)\n(.*?)\n(.*?)\n(.*?)\n'
    matches = re.findall(pattern, content, re.MULTILINE | re.DOTALL)
    
    questions = []
    for match in matches:
        story = match[0].strip()
        options = [match[1].strip(), match[2].strip(), match[3].strip(), match[4].strip()]
        questions.append({'Story': story, 'Options': options})
    
    return questions

def save_to_json(questions, output_file):
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    txt_file = 'questions.txt'
    output_file = 'output.json'
    questions = parse_questions(txt_file)
    save_to_json(questions, output_file)
    print("转换完成")
