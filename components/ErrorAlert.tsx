import ExclamationCircleIcon from "./ExclamationCircleIcon";

type Props = {
  error: string;
};

export default function WarningsAlert({ error }: Props): JSX.Element {
  return (
    <div className="px-4 py-2 text-red-600 bg-red-500 bg-opacity-10 border-0 rounded-md">
      <div className="flex gap-4 items-center">
        <div className="">
          <ExclamationCircleIcon />
        </div>
        <div className="text-sm">{error}</div>
      </div>
    </div>
  );
}
