import React, { useEffect, useState } from 'react';
import {
    TextField,
    CircularProgress,
    InputAdornment,
    IconButton
} from '@mui/material';
import './SearchPage.module.scss'
import OutsideClickHandler from 'react-outside-click-handler';
import useSearch from './useSearchCustom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/router';

const SearchBox = ({
    placeholder = "Search...",
    maxResults = 8,
    width = 400,
    autoFocus = false,
    onResultSelect,
    inputStyle = {},
}) => {
    const navigate = useRouter();
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);

    const { results, loading, error, showData, setShowData, hasMore } = useSearch(query, page);

    const filteredResults = results.filter(user =>
        user.product_name?.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (item) => {
        setShowData(false);
        setPage(1);
        if (onResultSelect) {
            onResultSelect(item);
        } else {
            navigate.push(`/search?query=${encodeURIComponent(item.product_name)}`);
            setQuery("")
        }
    };

    const handleSearch = () => {
        if (query.trim()) {
            navigate.push(`/search?query=${encodeURIComponent(query)}`);
            // navigate.push(`/search`);
            setQuery("")
            setPage(1);
            setShowData(false)
        }else{
            navigate.push(`/search`);
            setQuery("")
            setPage(1);
            setShowData(false)
        }
    };

    const loadMore = () => {
        if (hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <div className="position-relative" style={{ maxWidth: width }}>
            <TextField
                fullWidth
                autoComplete='false'
                // autoFocus={autoFocus}
                variant="outlined"
                size="small"
                type="search"
                color='primary'
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                    if (results.length) setShowData(true);
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        width: width,
                        height: 30,
                        fontSize: 12,
                        backgroundColor: 'white',
                        ...inputStyle
                    },
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" sx={{ width: 32 }}>
                            <div
                                style={{
                                    width: 24,
                                    height: 24,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {loading ? (
                                    <CircularProgress size={12} />
                                ) : (
                                    <IconButton edge="end" size="small" sx={{ padding: 0 }} onClick={handleSearch}>
                                        <i className="ic_search cursor-pointer text-dark fs-14px" />
                                    </IconButton>
                                )}
                            </div>
                        </InputAdornment>
                    ),
                }}
            />

            {/* Suggestions Dropdown */}
            {showData && filteredResults.length > 0 && (
                <OutsideClickHandler onOutsideClick={() => { setShowData(false); setPage(1); }}>
                    <div id='scrollable-suggestion' className="suggestion position-absolute top-100 left-0 w-100 bg-white border rounded shadow" style={{ zIndex: 1000 }}>
                        {/* <InfiniteScroll
                            dataLength={filteredResults.length}
                            next={loadMore}
                            hasMore={hasMore}
                            scrollThreshold={0.95}
                            scrollableTarget="scrollable-suggestion"
                            loader={loading && <CircularProgress size={24} />}
                            endMessage={<p className="text-center">No more results</p>}
                        > */}
                        <ul className="list-group m-0">
                            {filteredResults.map((user) => (
                                <li
                                    key={user.id}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleSelect(user)}
                                    style={{ cursor: 'pointer', fontSize: 12 }}
                                >
                                    <strong>{user.product_name}</strong>
                                </li>
                            ))}
                        </ul>
                        {/* </InfiniteScroll> */}
                    </div>
                </OutsideClickHandler>
            )}
        </div>
    );
};

export default SearchBox;
