'use client';

import {createClient} from '@/lib/supabase/client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {Filter} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';

function SelectBookCategory({className}: {className?: string}) {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      (async () => {
        const supabase = createClient();
        const {data, error} = await supabase.from('category').select('categories');

        if (error) {
          console.error('Error fetching categories:', error);
          return;
        }

        if (data && data.length > 0) {
          const allCategories = ['All', ...(data[0].categories as string[])];
          setCategories(allCategories);
          localStorage.setItem('categories', JSON.stringify(allCategories));
        }
      })();
    }
  }, []);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(window.location.search);

    if (value === 'All') params.delete('category');
    else params.set('category', value);

    router.push(`/?${params.toString()}`);
  };

  return (
    <div className={className}>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full sm:w-[280px] backdrop-blur-md bg-white/10 ">
          <SelectValue
            placeholder={
              <span className="flex shadow-sm gap-2 items-center">
                <Filter className="w-4 h-4" />
                <p>Filter by category</p>
              </span>
            }
          />
        </SelectTrigger>

        <SelectContent className="scroll-smooth max-h-[55vh] backdrop-blur-xl bg-background/60 rounded-xl shadow-lg">
          <SelectGroup>
            <SelectLabel className="mb-2 text-xs uppercase text-muted-foreground">
              Select a category
            </SelectLabel>

            {categories.map(category => (
              <SelectItem
                value={category}
                key={category}
                className=" transition-colors cursor-pointer"
              >
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectBookCategory;
