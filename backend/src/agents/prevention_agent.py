from src.rag.simple_retriever import retrieve_relevant_context


def generate_prevention_plan(result, risk_score, risk_level):
    prediction = result.get("prediction", "Unknown")

    query = " ".join(result.get("evidence", []))
    rag_context = retrieve_relevant_context(query)

    context_text = "\n".join(
        [f"- {item['source']}: {item['content']}" for item in rag_context]
    )

    if prediction == "Phishing" or risk_score >= 75:
        action_plan = """
Immediate Actions:
- Do not click any links or download attachments.
- Do not enter passwords, OTPs, banking details, or personal information.
- Report the email to the security/SOC team.
- Verify the sender through an independent trusted channel.
- Quarantine or delete the email after reporting.

Long-Term Prevention:
- Enable MFA on sensitive accounts.
- Use email authentication checks such as SPF, DKIM, and DMARC.
- Maintain updated phishing awareness training.
- Monitor similar emails using threat intelligence feeds.
"""
    elif risk_score >= 45:
        action_plan = """
Immediate Actions:
- Treat this email with caution.
- Verify the sender before responding.
- Avoid opening links until manually checked.
- Check whether the email domain matches the official organization.

Long-Term Prevention:
- Keep suspicious email logs for future analysis.
- Add similar patterns to the RAG knowledge base.
- Improve user awareness against social engineering.
"""
    else:
        action_plan = """
Immediate Actions:
- No strong phishing indicators were found.
- Still verify the sender if the email is unexpected.
- Avoid sharing sensitive information unless the source is trusted.

Long-Term Prevention:
- Continue monitoring for evolving phishing patterns.
- Keep detection rules and knowledge base updated.
"""

    return f"""
Risk Level: {risk_level}
Risk Score: {risk_score}/100

{action_plan}

RAG Knowledge Used:
{context_text if context_text else "No matching knowledge-base context found."}
"""