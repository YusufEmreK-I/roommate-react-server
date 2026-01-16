import Link from "next/link";
import { Home } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  actionHref,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm text-center px-4">
      <div className="bg-green-50 p-4 rounded-full mb-4 text-green-600">
        <Home size={32} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      <Link
        href={actionHref}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-green-100"
      >
        {actionLabel}
      </Link>
    </div>
  );
};

export default EmptyState;
