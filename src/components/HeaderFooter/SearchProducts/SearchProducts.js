import React, { useEffect, useState } from 'react';
import './SearchProducts.module.scss';
import { useSelector } from 'react-redux';
import commanService from '../../../CommanService/commanService';
import { changeUrl, RandomId } from '../../../CommanFunctions/commanFunctions';
import Loader from '../../../CommanUIComp/Loader/Loader';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from "next/image";

const SearchProducts = (props) => {
    const navigate = useRouter();
    const selector = useSelector((state) => state);
    const isLogin = Object.keys(selector.loginData).length > 0;

    const [searchTerm, setSearchTerm] = useState("");
    const [suggestionLinkArr, setSuggestion] = useState(props.navMenuFirst ? props.navMenuFirst : []);

    const [loading, setLoading] = useState(false);
    const [jewelleryProducts, setJewelleryProducts] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [filterParams, setFilterParams] = useState([]);
    const [storeItemObj, setStoreItemObj] = useState({
        a: "getStoreItems",
        user_id: isLogin ? selector.loginData.member_id : RandomId,
        SITDeveloper: "1",
        miniprogram_id: selector.storeEntityId.mini_program_id,
        tenant_id: selector.storeEntityId.tenant_id,
        entity_id: selector.storeEntityId.entity_id,
        per_page: "4",
        number: "1",
        filters: JSON.stringify(filterParams),
        from_price: "",
        to_price: "",
        extra_currency: selector.storeCurrency,
        secret_key: selector.storeEntityId.secret_key,
        product_diy: "PRODUCT",
        store_type: "B2C",
        vertical_code: "JEWEL",
        name: searchTerm,
    });

    const fetchJewelleryProductData = (itemObj) => {
        setLoading(true);
        commanService.postApi("/EmbeddedPageMaster", itemObj).then((res) => {
            if (res.data.success === 1) {
                setJewelleryProducts(res.data.data.resData);
                setTotalRows(res.data.data.total_rows);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }).catch(() => setLoading(false));
    };

    const fetchJewelleryItemSearchFilter = (searchJewelleryObj) => {
        commanService.postApi("/EmbeddedPageMaster", searchJewelleryObj).then((response) => {
            if (response.data.success === 1) {
                const storeArr = [];
                const arr = [...response.data.data];
                if (arr.length > 0) {
                    arr.forEach((e) => {
                        const obj1 = {
                            key: e.fielter_key,
                            value: [],
                        };
                        storeArr.push(obj1);
                    });
                };
                setFilterParams(storeArr);
                const obj = { ...storeItemObj, filters: JSON.stringify(storeArr) };
                setStoreItemObj(obj);
                setLoading(false);
            } else {
                setLoading(false);
            };
        }).catch(() => setLoading(false));
    };

    useEffect(() => {
        if (searchTerm.length > 2) {
            const obj = { ...storeItemObj, name: searchTerm };
            setStoreItemObj(obj);
            fetchJewelleryProductData(obj);
        }
    }, [searchTerm]);

    const initializeItemSearchFiltersForJewellery = () => {
        setLoading(true);
        if (Object.keys(selector.storeEntityId).length > 0) {
            const searchJewelleryFilterObject = {
                SITDeveloper: "1",
                a: "GetItemSearchFiltersForJewellery",
                entity_id: selector.storeEntityId.entity_id,
                miniprogram_id: selector.storeEntityId.mini_program_id,
                secret_key: selector.storeEntityId.secret_key,
                tenant_id: selector.storeEntityId.tenant_id,
                vertical_code: "JEWEL",
            };
            fetchJewelleryItemSearchFilter(searchJewelleryFilterObject);
        }
    };

    useEffect(() => {
        initializeItemSearchFiltersForJewellery();
    }, []);

    const handleChangeSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSelectProduct = (productInfo) => {
        if (productInfo) {
            const productName = productInfo.jewellery_product_type_name ? productInfo.jewellery_product_type_name.toLowerCase() : ""
            if (productInfo.vertical_code === "JEWEL") {
                navigate.push(`/product/${productInfo.vertical_code}/type/${productName}/${changeUrl((`${productInfo.product_name + "-" + productInfo.variant_unique_id}`))}`)
            }
            setSearchTerm("");
        };
        props.setIsSearch(false);
    };

    const handleCloseContainer = () => {
        props.setIsSearch(false);
        setSearchTerm("");
    };

    return (
        <React.Fragment>
            {loading && <Loader />}
            <section className='searchContainer'>
                {props.isSearch ?
                    <div className='inputContainer'>
                        <div className='inputWrapper'>
                            <input type='text' placeholder='Search' value={searchTerm} onChange={handleChangeSearch} />
                            <button onClick={() => handleCloseContainer()}><i className='ic_remove'></i></button>
                        </div>
                        {props.isSearch ? "" : <div>
                            <i className='ic_search' />
                        </div>}

                    </div> : ""}
                {searchTerm.length > 2 &&
                    <main className='resultsContainer'>
                        <div className='resultsWrapper'>
                            <div className='productsResults'>
                                {jewelleryProducts.length > 0 ? jewelleryProducts.map((product, index) => {
                                    return (<div className='productCard cursor-pointer' key={index} onClick={() => handleSelectProduct(product)}>
                                        <div className='imageWrapper'>
                                            {product.image_types ? product.image_types.length ? <Image alt="" src={product.image_urls[0]} /> : "" : ""}
                                        </div>
                                        <div className='productDetailsWrapper'>
                                            <h3 className='productTitle'>{product.product_name && product.product_name}</h3>
                                            <h5 className='product-sku-id'>{product.product_sku && product.product_sku}</h5>
                                            <h6 className='text-dark hover '>{product.currency_symbol + " " + product.final_total_display}</h6>
                                        </div>
                                    </div>)
                                }) :
                                    searchTerm.length > 2 ?
                                        <div>
                                            <p className='text-secondary fw-semibold'>NO RESULTS FOUND</p>

                                            {suggestionLinkArr ? suggestionLinkArr.filter((menu) => {
                                                return menu.product_vertical_name === "JEWEL"
                                            }).map((filteredMenu, index) => {
                                                const url = typeof (filteredMenu) === "object" ? filteredMenu.router_link ? (filteredMenu.router_link).toLowerCase() : "" : "";
                                                return (<p key={index}>
                                                    <Link href={url}>{filteredMenu.menu_name}</Link>
                                                </p>)
                                            })
                                                :
                                                ""
                                            }
                                        </div>
                                        : " "
                                }
                            </div>
                            {jewelleryProducts.length > 0 ?
                                <p>
                                    <Link href={`/search/${searchTerm}`}>View All {`(${totalRows})`}</Link>
                                </p> : ""}
                        </div>
                    </main>
                }
            </section>


        </React.Fragment>
    )
}

export default SearchProducts;