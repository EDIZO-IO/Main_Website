import zipfile
import xml.etree.ElementTree as ET

def extract_text_from_docx(docx_path):
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    with zipfile.ZipFile(docx_path) as docx:
        with docx.open('word/document.xml') as doc_xml:
            tree = ET.parse(doc_xml)
            root = tree.getroot()
            paragraphs = []
            for p in root.findall('.//w:p', ns):
                texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
                if texts:
                    paragraphs.append(''.join(texts))
            return '\n'.join(paragraphs)

print(extract_text_from_docx(r'D:\edizo\EDIZO_Website_Content.docx'))
