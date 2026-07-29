import base64, os
d = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(d,'LOgoQR.jpg'),'rb') as f:
    logo = base64.b64encode(f.read()).decode()
with open(os.path.join(d,'QRLOA.png'),'rb') as f:
    qrloa = base64.b64encode(f.read()).decode()
print(f"LOGO_LEN={len(logo)}")
print(f"QRLOA_LEN={len(qrloa)}")
with open(os.path.join(d,'logo_b64.txt'),'w') as f: f.write(logo)
with open(os.path.join(d,'qrloa_b64.txt'),'w') as f: f.write(qrloa)
print("Done")
