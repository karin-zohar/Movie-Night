import type { MovieFilter } from "@/types/movie";
import { Form } from "antd";
import { type Dispatch, type FC, type SetStateAction, useCallback } from "react";
import { debounce } from "es-toolkit";
import SearchBar from "./components/SearchBar";
import Categories from "./components/Categories";
import './movie-filters.style.css';

type MovieFiltersProps = {
    setFilter: Dispatch<SetStateAction<MovieFilter>>;
};

const MovieFilters: FC<MovieFiltersProps> = ({ setFilter }) => {
    const [form] = Form.useForm<MovieFilter>();

    const debouncedSetSearch = useCallback(
        debounce((search: string) => {
            const trimmed = search.trim();
            if (trimmed.length === 0 || trimmed.length >= 2) {
                setFilter((prev) => ({ ...prev, search: trimmed }));
            }
        }, 500),
        [setFilter]
    );

    const onValuesChange = (changedValues: Partial<MovieFilter>) => {
        if ("search" in changedValues) {
            debouncedSetSearch(changedValues.search ?? "");
        }
        if ("category" in changedValues) {
            setFilter((prev) => ({ ...prev, category: changedValues.category }));
        }
    };

    return (
        <div className="movie-filters">
            <Form<MovieFilter>
                form={form}
                initialValues={{ category: "popular" }}
                onValuesChange={onValuesChange}
            >
                <Form.Item name="search">
                    <SearchBar />
                </Form.Item>
                <Form.Item name="category" initialValue="popular">
                    <Categories />
                </Form.Item>
            </Form>
        </div>
    );
};

export default MovieFilters;