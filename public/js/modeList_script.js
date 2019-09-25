
function deleteMode(id) {

    let modeID = JSON.parse(id);
    deletePost({modeID});
}

const deletePost = async (modeData) => {
    const response = await fetch('/database/deleteMode', {
    method: 'POST',
    body: JSON.stringify(modeData), // string or object
    headers: {
        'Content-Type': 'application/json'
    }
});
    const myJson = await response.json(); //extract JSON from the http response
    console.log(myJson);
    location.reload();
};

function makeCurrent(id) {

    let modeID = JSON.parse(id);
    setMode({modeID});
    
}

const setMode = async (modeData) => {
    const response = await fetch('/hueAPI/setMode', {
    method: 'POST',
    body: JSON.stringify(modeData), // string or object
    headers: {
        'Content-Type': 'application/json'
    }
});
    const myJson = await response.json(); //extract JSON from the http response
    console.log(myJson);
    //location.reload();
};



