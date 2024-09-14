import ExclamationIcon from "./ExclamationIcon";

type Props = {
  warnings: string[];
};

export default function WarningsAlert({ warnings }: Props): JSX.Element {
  return (
    <div className="px-4 py-2 text-yellow-800 bg-yellow-500 bg-opacity-10 border-0 rounded-md">
      <div className="flex gap-4">
        <div className="text-yellow-500">
          <ExclamationIcon />
        </div>
        <div className="self-center text-sm">
          {warnings.length > 1 ? (
            <ul className="pl-4 leading-relaxed list-disc">
              {warnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          ) : (
            <span>{warnings[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
}
