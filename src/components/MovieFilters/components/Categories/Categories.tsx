import GenRadioButtons from "@/libs/ui/components/GenRadioGroup/GenRadioGroup";
import type { RadioChangeEvent } from "antd";
import type { FC } from "react";

const categoryOptions = [
    { label: "Popular", value: "popular" },
    { label: "Airing Now", value: "now_playing" },
    { label: "My Favorites", value: "my_favorites" },
];

type CategoriesProps = {
    value?: string;
    onChange?: (e: RadioChangeEvent) => void;
};

const Categories: FC<CategoriesProps> = ({ value, onChange }) => {
    return (
        <GenRadioButtons
            options={categoryOptions}
            value={value}
            onChange={onChange}
            optionType="button"
            buttonStyle="solid"
        />
    );
};

export default Categories;
