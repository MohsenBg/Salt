import React, { useEffect, useState } from "react";
import styles from "./SearchUser.module.scss";
import { BiSearchAlt } from "react-icons/bi";
import { RiArrowGoBackFill } from "react-icons/ri";
import animejs from "animejs";
import axios from "axios";
import { url } from "../../../url";
import { useSelector } from "react-redux";
import { STORE_STATE } from "../../../store";

const SearchUser = ({
  setResult,
  searchHandel,
  searchStatus,
  endSearch,
}: any) => {
  const username = useSelector((state: STORE_STATE) => state.userInfo.username);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    let source = axios.CancelToken.source();
    const handelSearch = async () => {
      if (searchValue.length < 3) return setResult(null);
      await axios
        .get(`${url}/search/${searchValue}`, { cancelToken: source.token })
        .then((result) => {
          let search = result.data.filter(
            (user: any) => user.userName !== username
          );
          setResult(search);
        })
        .catch((error) => {
          if (!axios.isCancel(error)) console.log(error);
        });
    };
    handelSearch();
    return () => source.cancel();
  }, [searchValue]);

  const BackSearch = () => {
    if (!searchStatus) return;
    let inputSearch = document.getElementById("input-search");
    let inputSearchIcon = document.getElementById("input-search-icon");
    let backSearch = document.getElementById("back-search");
    animejs({
      targets: inputSearch,
      translateX: 0,
      duration: 1000,
      easing: "easeInOutExpo",
    });
    animejs({
      targets: inputSearchIcon,
      translateX: 0,
      duration: 1000,
      easing: "easeInOutExpo",
    });
    animejs({
      targets: backSearch,
      opacity: 0,
      duration: 1000,
      easing: "easeInOutExpo",
    });
    setTimeout(() => {
      searchHandel(false);
    }, 1000);
    setResult(null);
    //@ts-ignore
    inputSearch?.value = "";
  };

  useEffect(() => {
    let inputSearch = document.getElementById("input-search");
    let backSearch = document.getElementById("back-search");
    let inputSearchIcon = document.getElementById("input-search-icon");

    const handelFocus = () => {
      if (searchStatus) return;
      searchHandel(true);
      animejs({
        targets: inputSearch,
        translateX: 25,
        duration: 1000,
        easing: "easeInOutExpo",
      });
      animejs({
        targets: inputSearchIcon,
        translateX: 25,
        duration: 1000,
        easing: "easeInOutExpo",
      });
      animejs({
        targets: backSearch,
        opacity: 1,
        duration: 1000,
        easing: "easeInOutExpo",
      });
    };
    inputSearch?.addEventListener("focus", handelFocus);
  }, []);

  useEffect(() => {
    BackSearch();
  }, [endSearch]);

  return (
    <div className={styles.search}>
      <div className={styles.searchContainer}>
        <input
          id="input-search"
          className={styles.inputSearch}
          contentEditable="true"
          placeholder="Search By username"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className={styles.iconSearch} id="input-search-icon">
          <BiSearchAlt />
        </div>
      </div>
      <div className={styles.backIcon} id="back-search" onClick={BackSearch}>
        {searchStatus ? <RiArrowGoBackFill /> : null}
      </div>
    </div>
  );
};

export default SearchUser;
