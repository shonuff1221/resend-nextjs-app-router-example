"use client";

import { useEffect, useRef, useState } from "react";

export default function EmailForm() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [from, setFrom] = useState("info@ejm.services");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML !== body) {
      editorRef.current.innerHTML = body;
    }
  }, [body]);

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    setBody(editorRef.current?.innerHTML ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("to", to);
      formData.append("subject", subject);
      formData.append("body", body);
      formData.append("from", from);

      const files = fileInputRef.current?.files;
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("attachments", file);
        });
      }

      const response = await fetch("/api/send", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Email sent successfully!" });
        setTo("");
        setSubject("");
        setBody("");
        if (editorRef.current) {
          editorRef.current.innerHTML = "";
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to send email",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while sending the email",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="h1">Send Email</h1>
        <p className="subtle">
          Format the body with the editor below. Your message is sent as HTML.
        </p>

        {message && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="grid-2">
            <div>
              <label htmlFor="from" className="label">
                From
              </label>
              <input
                type="text"
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="input"
                placeholder="sender@example.com"
              />
            </div>

            <div>
              <label htmlFor="to" className="label">
                To (comma-separated)
              </label>
              <input
                type="text"
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="input"
                placeholder="recipient@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="label">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input"
              placeholder="Email subject"
              required
            />
          </div>

          <div>
            <label className="label">Body</label>
            <div className="rte">
              <div className="rte-toolbar">
                <button
                  type="button"
                  className="rte-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => exec("bold")}
                >
                  Bold
                </button>
                <button
                  type="button"
                  className="rte-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => exec("italic")}
                >
                  Italic
                </button>
                <button
                  type="button"
                  className="rte-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => exec("underline")}
                >
                  Underline
                </button>
                <button
                  type="button"
                  className="rte-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => exec("insertUnorderedList")}
                >
                  Bullets
                </button>
                <button
                  type="button"
                  className="rte-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => exec("insertOrderedList")}
                >
                  Numbered
                </button>
                <button
                  type="button"
                  className="rte-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    const url = window.prompt("Link URL");
                    if (url) exec("createLink", url);
                  }}
                >
                  Link
                </button>
                <button
                  type="button"
                  className="rte-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => exec("removeFormat")}
                >
                  Clear
                </button>
              </div>

              <div
                ref={editorRef}
                className="rte-editor"
                contentEditable
                role="textbox"
                aria-label="Email body"
                data-placeholder="Write your email here…"
                onInput={() => setBody(editorRef.current?.innerHTML ?? "")}
              />
            </div>
            <div className="helper">
              Tip: paste from Google Docs/Word and then use “Clear” to remove
              extra formatting.
            </div>
          </div>

          <div>
            <label htmlFor="attachments" className="label">
              Attachments
            </label>
            <input
              type="file"
              id="attachments"
              ref={fileInputRef}
              multiple
              className="input"
            />
            <div className="helper">You can select multiple files</div>
          </div>

          <div>
            <label className="label">Preview</label>
            <div
              className="preview"
              dangerouslySetInnerHTML={{ __html: body || "<em>(empty)</em>" }}
            />
          </div>

          <button type="submit" disabled={loading} className="button">
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
