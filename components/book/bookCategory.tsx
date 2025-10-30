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
    async function fetchCategories() {
      const supabase = createClient();
      const {data, error} = await supabase.from('category').select('categories');

      if (error) {
        console.error(error);
        return;
      }

      if (data && data.length > 0) {
        const allCategories = data[0].categories as string[];
        setCategories(['All', ...allCategories]);
      }
    }

    fetchCategories();
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
        <SelectTrigger className="w-[280px] backdrop-blur-md bg-white/10 border border-white/20">
          <SelectValue
            placeholder={
              <span className="flex gap-2 items-center">
                <Filter className="w-4 h-4" />
                <p>Filter by category</p>
              </span>
            }
          />
        </SelectTrigger>

        <SelectContent className="scroll-smooth max-h-[55vh] backdrop-blur-xl bg-background/80 border border-white/10 rounded-xl shadow-lg">
          <SelectGroup>
            <SelectLabel className="mb-2 text-xs uppercase text-muted-foreground">
              Select a category
            </SelectLabel>

            {categories.map(category => (
              <SelectItem
                value={category}
                key={category}
                className="hover:bg-white/10 transition-colors cursor-pointer"
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
