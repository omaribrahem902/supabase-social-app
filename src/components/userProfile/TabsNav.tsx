export const TabsNav = ({ activeTab, onChange }: { activeTab: string; onChange: (t: any) => void }) => {
    const tabs: { key: 'posts' | 'communities'; label: string }[] = [
      { key: 'posts', label: 'Posts' },
      { key: 'communities', label: 'Communities' },
    ];
  
    return (
      <nav>
        <ul className="flex gap-6 border-b border-gray-100 pb-3">
          {tabs.map((t) => (
            <li key={t.key}>
              <button
                onClick={() => onChange(t.key)}
                className={`pb-2 text-sm font-medium cursor-pointer ${activeTab === t.key ? 'text-gray-900 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }