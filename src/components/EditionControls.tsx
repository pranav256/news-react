import { useId } from 'react';
import { motion } from 'motion/react';
import { categories, countries, type Country, type Category } from '@/lib/feed';

export default function EditionControls({ country, category, onCountry, onCategory }: { country: Country; category: Category; onCountry: (value: Country) => void; onCategory: (value: Category) => void }) {
  const id = useId();
  return <div className="edition-controls">
    <div className="country-switch" role="group" aria-label="Country">
      {Object.entries(countries).map(([code, name]) => <button type="button" key={code} aria-pressed={country === code} onClick={() => onCountry(code as Country)}>
        {country === code && <motion.span className="switch-indicator" layoutId={id + '-country'} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
        <span className="country-abbreviation">{code.toUpperCase()}</span><span>{name === 'United States' ? 'United States' : name === 'United Kingdom' ? 'United Kingdom' : name}</span>
      </button>)}
    </div>
    <div className="category-tabs" role="group" aria-label="News category">
      {categories.map(value => <button type="button" key={value} aria-pressed={category === value} onClick={() => onCategory(value)}>
        {category === value && <motion.span className="switch-indicator" layoutId={id + '-category'} transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
        <span>{value === 'general' ? 'Top stories' : value.charAt(0).toUpperCase() + value.slice(1)}</span>
      </button>)}
    </div>
  </div>;
}
