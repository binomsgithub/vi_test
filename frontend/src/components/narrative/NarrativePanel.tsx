import { NarrativeContent } from '../../types/narrative';

interface NarrativePanelProps {
  content: NarrativeContent;
}

export function NarrativePanel({ content }: NarrativePanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-full mb-2">
          Narrative
        </span>
        <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
      </div>
      
      {content.intro && (
        <p className="text-gray-700 mb-4 leading-relaxed">{content.intro}</p>
      )}
      
      <div className="space-y-4">
        {content.blocks.map((block) => (
          <div key={block.id} className="space-y-2">
            <h4 className="text-base font-semibold text-gray-800">{block.heading}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{block.body}</p>
          </div>
        ))}
      </div>
      
      {content.footerNote && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 italic">{content.footerNote}</p>
        </div>
      )}
    </div>
  );
}

