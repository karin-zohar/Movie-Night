import type { FC } from 'react';
import { EraserIcon, SearchIcon } from '@/libs/ui/icons';
import { Input } from 'antd';

type SearchBarProps = {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => {
    return (
        <Input
            value={value}
            placeholder='Search for a movie'
            className="search-bar"
            prefix={<SearchIcon />}
            onChange={onChange}
            allowClear={{ clearIcon: <EraserIcon /> }}
        />
    );
};

export default SearchBar;
