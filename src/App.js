import React, { useState, useEffect } from "react";
import Constant from "./constant";
import InfiniteScroll from "react-infinite-scroll-component";
import spinnerGIF from "./images/spinner.gif";

const App = () => {
  const [news, setNews] = useState([]);
  const [sources, setSources] = useState([]);

  const [selectedSource, setSelectedSource] = useState();
  const [searchText, setSearchText] = useState();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [url, setUrl] = useState(
    `https://newsapi.org/v2/top-headlines?country=in&page=${page}&apiKey=${Constant.NEWS_API_KEY}`
  );
  useEffect(() => {
    console.log({ totalPage });
    if (selectedSource) {
      setUrl(
        `https://newsapi.org/v2/top-headlines?sources=${selectedSource}&page=${page}&apiKey=${Constant.NEWS_API_KEY}`
      );
    } else if (searchText) {
      setUrl(
        `https://newsapi.org/v2/everything?q=${searchText}&page=${page}&apiKey=${Constant.NEWS_API_KEY}`
      );
    } else {
      setUrl(
        `https://newsapi.org/v2/top-headlines?country=in&page=${page}&apiKey=${Constant.NEWS_API_KEY}`
      );
    }

    const fetchApi = async () => {
      const res = await fetch(url);
      const resJson = await res.json();
      console.log("res", resJson);
      if (resJson.status == "ok") {
        setTotalPage(Math.ceil(resJson.totalResults / 20));
        if (page == 1) {
          setNews(resJson.articles);
        } else {
          let temp = [...news, ...resJson.articles];
          setNews(temp);
        }
      }
    };

    fetchApi();
  }, [setNews, selectedSource, searchText, url, page]);

  console.log({ url });

  useEffect(() => {
    const fetchApi = async () => {
      const url = `https://newsapi.org/v2/top-headlines/sources?apiKey=${Constant.NEWS_API_KEY}`;
      const res = await fetch(url);
      const resJson = await res.json();
      if (resJson.status == "ok") {
        setSources(resJson.sources);
      }
    };

    fetchApi();
  }, [setSources]);

  return (
    <>
      <div className="main">
        <header>
          <h1>
            <span style={{ color: "#ff0084" }}>REACT</span>
            <span style={{ color: "#0400ff" }}>NEWS</span>
          </h1>
        </header>
        <div className="panel">
          <div className="source-filter">
            <select
              onChange={async (e) => {
                setSearchText("");
                setSelectedSource(e.target.value);
              }}
              value={selectedSource}
            >
              <option value="">Select Source</option>
              {sources && sources.length
                ? sources.map((source) => {
                    return (
                      <option value={source.id} key={source.id}>
                        {source.name}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
          <input
            type="button"
            value="Clear"
            onClick={() => {
              setSearchText("");
              setSelectedSource("");
            }}
          />
          <div className="search">
            <input
              type="text"
              placeholder="Search News"
              value={searchText}
              onChange={(e) => {
                setSelectedSource("");
                setSearchText(e.target.value);
              }}
            />
          </div>
        </div>
        <div
          id="paginationDiv"
          style={{
            height: `Calc(${100}vh - ${205}px)`,
            overflow: "auto",
          }}
        >
          <InfiniteScroll
            dataLength={news?.length} //This is important field to render the next data
            next={() => {
              setPage((temp) => temp + 1);
              console.log({ page });
            }}
            hasMore={totalPage > page}
            loader={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={spinnerGIF} alt="spinner" height={50} width={50} />
              </div>
            }
            scrollableTarget="paginationDiv"
          >
            <div className="content">
              {news && news.length ? (
                news.map((n, i) => {
                  return (
                    <div
                      className="card"
                      key={i}
                      onClick={() => {
                        window.open(n.url);
                      }}
                    >
                      {/* <div className="overlay"></div> */}
                      <div className="card-header">
                        <div className="card-title">{n.title}</div>
                        <div className="card-subtitle">
                          -- {n.author ? n.author : "Unknown Author"}
                        </div>
                      </div>
                      <div className="card-body">
                        <img
                          src={n.urlToImage ? n.urlToImage : null}
                          style={{ height: "170px", width: "auto" }}
                        />
                        <div className="card-description">{n.description}</div>
                        <div className="card-extra">
                          {n.publishedAt.split("T")[0]}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <h1>No news to display</h1>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};

export default App;
