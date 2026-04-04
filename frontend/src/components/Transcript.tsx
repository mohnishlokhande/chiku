interface TranscriptProps {
  userText: string;
  reply: string;
}

export function Transcript({ userText, reply }: TranscriptProps) {
  if (!userText && !reply) return null;

  return (
    <div className="transcript">
      {userText && (
        <p className="transcript__user">
          <span className="transcript__label">You:</span> {userText}
        </p>
      )}
      {reply && (
        <p className="transcript__reply">
          <span className="transcript__label">Alive:</span> {reply}
        </p>
      )}
    </div>
  );
}
