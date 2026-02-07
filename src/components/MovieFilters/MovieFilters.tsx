import type { MovieFilter } from "@/types/movie";
import { Form } from "antd";
import { type Dispatch, type FC, type SetStateAction, useCallback, useEffect, useRef } from "react";
import { debounce } from "es-toolkit";
import SearchBar from "./components/SearchBar";
import Categories from "./components/Categories";
import './movie-filters.style.css';

type MovieFiltersProps = {
    setFilter: Dispatch<SetStateAction<MovieFilter>>;
    initialCategory?: MovieFilter["category"];
};

const MIN_SEARCH_LENGTH = 2
const DEFAULT_CATEGORY: MovieFilter["category"] = "popular"
const FOCUS_DELAY_MS = 2000

const MovieFilters: FC<MovieFiltersProps> = ({ setFilter, initialCategory = DEFAULT_CATEGORY }) => {
    const [form] = Form.useForm<MovieFilter>();
    const focusTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        return () => clearTimeout(focusTimerRef.current);
    }, []);

    const debouncedSetSearch = useCallback(
        debounce((search: string) => {
            const trimmed = search.trim();
            const category = form.getFieldValue("category") ?? DEFAULT_CATEGORY;

            const newFilter = trimmed.length >= MIN_SEARCH_LENGTH
                ? { search: trimmed }
                : { category };

            setFilter(newFilter);
        }, 500),
        [setFilter, form]
    );

    const handleCategorySelect = useCallback((category: MovieFilter["category"]) => {
        clearTimeout(focusTimerRef.current);
        debouncedSetSearch.cancel();
        form.setFieldsValue({ category, search: "" });
        setFilter({ category });
    }, [form, debouncedSetSearch, setFilter]);

    const handleCategoryFocus = useCallback((category: MovieFilter["category"]) => {
        clearTimeout(focusTimerRef.current);

        const currentCategory = form.getFieldValue("category");
        if (category === currentCategory) return;

        focusTimerRef.current = setTimeout(() => {
            handleCategorySelect(category);
        }, FOCUS_DELAY_MS);
    }, [form, handleCategorySelect]);

    const handleCategoryBlur = useCallback(() => {
        clearTimeout(focusTimerRef.current);
    }, []);

    const onValuesChange = useCallback((changedValues: Partial<MovieFilter>) => {
        const { search, category } = changedValues;

        if (search !== undefined) {
            clearTimeout(focusTimerRef.current);
            const trimmed = search.trim();

            if (trimmed.length >= MIN_SEARCH_LENGTH) {
                form.setFieldsValue({ category: undefined });
            } else if (trimmed.length === 0) {
                form.setFieldsValue({ category: DEFAULT_CATEGORY });
            }

            debouncedSetSearch(search);
        }

        if (category !== undefined) {
            handleCategorySelect(category);
        }
    }, [form, debouncedSetSearch, setFilter, handleCategorySelect]);

    return (
        <div className="movie-filters">
            <Form<MovieFilter>
                form={form}
                onValuesChange={onValuesChange}
            >
                <Form.Item name="search">
                    <SearchBar />
                </Form.Item>
                <Form.Item name="category" initialValue={initialCategory}>
                    <Categories
                        onSelect={handleCategorySelect}
                        onCategoryFocus={handleCategoryFocus}
                        onCategoryBlur={handleCategoryBlur}
                    />
                </Form.Item>
            </Form>
        </div>
    );
};

export default MovieFilters;