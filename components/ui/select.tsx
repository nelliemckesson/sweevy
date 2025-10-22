'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function Select(
  { title, defaultValue, options }: { title: string, defaultValue: string, options: string[] }
) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('resume', e.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <select value={defaultValue} onChange={handleChange} className="border text-sm p-1 rounded-sm">
      <option value="default">{title}</option>
      {options.map(item => {
        return <option key={item} value={item}>{item}</option>
      })}      
    </select>
  );
}