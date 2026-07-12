type FormErrorMessagesProps = {
  message: string;
  className?: string;
};

export default function FormErrorMessages({
  message,
  className = "mt-4 text-sm font-semibold text-red-600",
}: FormErrorMessagesProps) {
  const messages = message
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (messages.length === 0) {
    return null;
  }

  if (messages.length === 1) {
    return <p className={`text-center ${className}`}>{messages[0]}</p>;
  }

  return (
    <ul className={`mx-auto max-w-md list-disc space-y-1 pl-5 text-left ${className}`}>
      {messages.map((entry, index) => (
        <li key={`${entry}-${index}`}>{entry}</li>
      ))}
    </ul>
  );
}
