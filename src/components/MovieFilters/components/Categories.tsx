import GenRadioButtons from "@/libs/ui/components/GenRadioGroup/GenRadioGroup";
import { Radio, type RadioChangeEvent } from "antd";
import type { FC } from "react";
import type { MovieFilter } from "@/types/movie";
import { KeyboardNavigable } from "@/providers/KeyboardNavigation";

const categoryOptions = [
    { label: "Popular", value: "popular" },
    { label: "Airing Now", value: "now_playing" },
    { label: "My Favorites", value: "my_favorites" },
];

type CategoriesProps = {
    value?: string;
    onChange?: (e: RadioChangeEvent) => void;
    onSelect?: (value: MovieFilter["category"]) => void;
};

const Categories: FC<CategoriesProps> = ({ value, onChange, onSelect }) => {
    return (
        <GenRadioButtons
            value={value}
            onChange={onChange}
            optionType="button"
            buttonStyle="solid"
        >
            {categoryOptions.map(option => (
                <KeyboardNavigable
                    key={option.value}
                    onActivate={() => onSelect?.(option.value as MovieFilter["category"])}
                >
                    <Radio.Button value={option.value}>
                        {option.label}
                    </Radio.Button>
                </KeyboardNavigable>
            ))}
        </GenRadioButtons>
    );
};

export default Categories;
