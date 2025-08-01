import { useState, useEffect } from 'react';
import commanService from '../../../CommanService/commanService';
import { useSelector } from 'react-redux';
import { RandomId } from '../../../CommanFunctions/commanFunctions';

const useSearch = (query, page) => {
    const selector = useSelector((state) => state);
    const isLogin = Object.keys(selector.loginData).length > 0;

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showData, setShowData] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setShowData(false);
            setHasMore(false);
            setError(null);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const obj = {
                a: "getStoreItems",
                user_id: isLogin ? selector.loginData.member_id : RandomId,
                SITDeveloper: "1",
                miniprogram_id: selector.storeEntityId.mini_program_id,
                tenant_id: selector.storeEntityId.tenant_id,
                entity_id: selector.storeEntityId.entity_id,
                per_page: "16",
                number: page,
                filters: "[]",
                from_price: "",
                to_price: "",
                extra_currency: selector.storeCurrency,
                secret_key: selector.storeEntityId.secret_key,
                product_diy: "PRODUCT",
                store_type: "B2C",
                vertical_code: "JEWEL",
                name: query,
            };
            commanService.postApi("/EmbeddedPageMaster", obj).then((response) => {
                const datas = response.data.data.resData || [];
                if (page === 1) {
                    setResults(datas)
                } else {
                    setResults((prevResults) => [...prevResults, ...datas]);
                }
                setHasMore(datas.length > 15);
                setShowData(true);
                setLoading(false);
            }).catch((err => {
                console.error("Search suggestions API error:", err);
                setError(err);
                setShowData(false);
            }))
        };

        const delayDebounce = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query, page, isLogin, selector]);

    return { results, loading, setLoading, error, showData, setShowData, hasMore };
};

export default useSearch;
