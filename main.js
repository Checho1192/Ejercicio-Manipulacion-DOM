url = 'https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json'
function getData(url) {
    return (fetch(url)
        .then(response => response.json()));
}

getData(url).then((data) => console.log(data));
