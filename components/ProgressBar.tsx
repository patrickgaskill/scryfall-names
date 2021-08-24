type Props = {
  value: number;
  total: number;
};

export default function ProgressBar({ value, total }: Props): JSX.Element {
  const width = total === 0 ? 0 : (value / total) * 100 + "%";
  return (
    <div className="relative pt-1">
      <div className="flex h-0.5 text-xs bg-purple-200 overflow-hidden">
        <div
          style={{ width }}
          className="flex flex-col justify-center text-center text-white whitespace-nowrap bg-purple-500 shadow-none"
        ></div>
      </div>
    </div>
  );
}
