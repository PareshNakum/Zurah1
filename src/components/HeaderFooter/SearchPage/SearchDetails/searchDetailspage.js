import React, { useState, useEffect } from "react";
import "./searchDetailspage.scss";
import {
    TextField,
    CircularProgress,
    InputAdornment,
    IconButton,
} from "@mui/material";
import useSearch from "../useSearchCustom";
import { changeUrl, isEmpty } from "../../../../CommanFunctions/commanFunctions";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../../../../CommanUIComp/Loader/Loader";
import NoRecordFound from "../../../../CommanUIComp/NoRecordFound/noRecordFound";
import Skeleton from "react-loading-skeleton";
import { Card } from "react-bootstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSelector } from "react-redux";
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from "next/router";
import Link from "next/link";


const SearchDetailsPage = () => {
    const location = useRouter();
    const selector = useSelector((state) => state)
    const urlQuery = new URLSearchParams(location.search).get("query") || "";

    const [inputQuery, setInputQuery] = useState(urlQuery);
    const [searchQuery, setSearchQuery] = useState(urlQuery);
    const [page, setPage] = useState(1);

    const { results, loading, setLoading, error, hasMore } = useSearch(searchQuery, page);

    useEffect(() => {
        setInputQuery(urlQuery);
        setSearchQuery(urlQuery);
    }, [urlQuery]);

    const handleSearch = () => {
        if (inputQuery.trim()) {
            setPage(1);
            setSearchQuery(inputQuery.trim());
            location.push(`/search?query=${encodeURIComponent(inputQuery.trim())}`);
        }
    };

    // Handle search input changes
    const handleSearchChange = (e) => {
        setInputQuery(e.target.value);
    }

    // Handle clearing the search
    const handleClear = () => {
        setInputQuery('');
        // setSearchQuery(''); 
        setPage(1);
    };

    const loadMore = () => {
        if (searchQuery && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <section id="product-details" className="container mt-4">
            <div className="row justify-content-center mb-4">
                <div id='scrollable-suggestion' className="col-md-6 col-sm-10 col-12">
                    <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        placeholder="Search"
                        value={inputQuery}
                        scrollThreshold={0.95}
                        scrollableTarget="scrollable-suggestion"
                        onChange={(e) => handleSearchChange(e)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {inputQuery && !loading && (
                                        <IconButton size="small" onClick={handleClear}>
                                            <button type="button" className="btn-close fs-12px" aria-label="Close"></button>
                                        </IconButton>
                                    )}
                                    <IconButton size="small" onClick={handleSearch} disabled={loading}>
                                        {loading ? (
                                            <CircularProgress size={12} />
                                        ) : (
                                            <i className="ic_search fs-16px text-dark" />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: 40,
                                fontSize: 14,
                            },
                        }}
                    />
                </div>
            </div>

            {isEmpty(searchQuery) !== "" && <h6 className="fs-14px me-2 my-1 profile-sub-heading">
                Showing results for <strong>{searchQuery}</strong>
            </h6>}

            <section id="product-details" className="container mt-4">
                {/* {loading && <Loader />} */}
                <InfiniteScroll
                    className="row"
                    dataLength={results.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={loading && Array.from({ length: 4 }).map((_, idx) => {
                        return (
                            <div className={`col-12 col-sm-6 col-md-3 col-lg-3 product-boxes box-resp`} key={idx}>
                                <Card className='product-box'>
                                    <div className="position-relative">
                                        <figure className='figure product-img-separate my-auto d-flex align-items-center justify-content-center Skeleton'>
                                            <Skeleton height={"100%"} />
                                        </figure>
                                    </div>
                                    <div className="product-detail d-flex justify-content-between w-100">
                                        <div className="w-100">
                                            <div className="detail-height w-100">
                                                <div className="mb-1 product-desc w-100">
                                                    <Skeleton />
                                                </div>
                                            </div>
                                            <div className='product-price w-100'>
                                                <h2 className="fs-15px"><Skeleton /></h2>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        );
                    })}
                    endMessage={!loading && results?.length === 0 && searchQuery && <NoRecordFound />}
                >
                    <React.Fragment>
                        {results?.length > 0 && (results.map((e, index) => {
                            return (
                                <div key={index} className='col-12 col-sm-6 col-md-3 col-lg-3 product-boxes box-resp'>
                                    <Link href={`/products/${e.vertical_code}/${changeUrl(e.product_name + "-" + e.variant_unique_id)}`}>
                                        <Card className='product-box'>
                                            <div className="position-relative">
                                                <figure className='figure product-img-separate my-auto d-flex align-items-center justify-content-center'>
                                                    <LazyLoadImage effect="blur" src={e?.image_urls[0]} alt="image" loading="lazy" width='100%' height="290px" />
                                                    {e?.image_urls[1] && (
                                                        <LazyLoadImage effect="blur" src={e.image_urls[1]} alt="image" loading="lazy" width='100%' height="290px" />
                                                    )}
                                                </figure>
                                            </div>
                                            <div className="product-detail d-flex justify-content-between">
                                                <div className="">
                                                    <div className="detail-height">
                                                        <div className="mb-1 product-desc">
                                                            <p>{e.product_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className='product-price'>
                                                        <h2 className="fs-15px">{selector.storeCurrency}{" "}
                                                            {isEmpty(e.coupon_code) != '' ? (
                                                                <>
                                                                    <span>{e.final_total_display} </span>
                                                                    {" "}<span className="offer-price">{selector.storeCurrency}{" "}{e.origional_price}</span>
                                                                </>
                                                            ) : <span>{e.final_total_display}</span>}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </div>
                            );
                        }))}
                    </React.Fragment>
                </InfiniteScroll>
            </section>
        </section>
    );
};

export default SearchDetailsPage;
