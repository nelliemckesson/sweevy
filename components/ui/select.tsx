'use client';

// options: [[id, label]]

export function Select(
  { 
    title, 
    defaultValue, 
    options, 
    handleSetValue 
  }: { 
    title: string, 
    defaultValue: string, 
    options: (string | number)[][], 
    handleSetValue: (value: string) => void 
  }
) {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSetValue(e.target.value);
  };

  return (
    <select value={defaultValue} onChange={handleChange} className="border text-sm p-1 rounded-sm">
      <option value="default">{title}</option>
      {options.map(item => {
        return <option key={item[0]} value={item[0]}>{item[1]}</option>
      })}      
    </select>
  );
}