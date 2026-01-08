from weasyprint import HTML

report_data = {
    "acc": "92%",
    "precision": "89%",
    "recall": "90%",
    "f1": "88%",
    "audio_file": "sample.wav",
    "prediction": "Stuttering Detected"
}

def generate_pdf(data):
    with open("templates/stutter_report.html") as f:
        html = f.read()

    for key, value in data.items():
        html = html.replace(f"{{{{{key}}}}}", value)

    with open("reports/temp.html", "w") as f:
        f.write(html)

    HTML("reports/temp.html").write_pdf("reports/Stutter_Detection_Report.pdf")
    print("PDF CREATED → reports/Stutter_Detection_Report.pdf")

generate_pdf(report_data)
