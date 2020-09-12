let storageType, navBarDocument, navBarForm, typeSelect, elementSelect, favoritesSelect;

window.onload = (e) => {
    navBarDocument = $('frame[src="frames/navbar.htm"]', top.document)[0].contentDocument;
    typeSelect = $("select[name='type']", navBarDocument);
    elementSelect = $("select[name='element']", navBarDocument);
    navBarForm = $("form[name='NavBar']", navBarDocument);

    addUi(navBarDocument);

    favoritesSelect = $("select[name='esr-favorites']", navBarDocument);

    start();
};

function start() {
    populateFavorites();

    getStorage('esrType').then(function(result) {
        // Gebruik de laatst gebruikte waarden
        if (result['esrType']) {
            typeSelect.val(result['esrType']);
            triggerEvent(navBarDocument, typeSelect, 'change');

            let elements = getOptions($("option", elementSelect));

            getStorage('esrElement').then(function(result) {
                if (result['esrElement']) {
                    let selectedText = result['esrElement'];
                    let selectedValue = elements[selectedText];
                    if (selectedValue) {
                        elementSelect.val(selectedValue);
                        triggerEvent(navBarDocument, elementSelect, 'change');
                    }
                }
            });
        }

        typeSelect.on("change", function(e) { onTypeChange(e);});
        elementSelect.on("change", function(e) { onElementChange(e);});
        typeSelect.on("click", function(e) { onTypeOrElementClick(e);});
        elementSelect.on("click", function(e) { onTypeOrElementClick(e);});

    });
}

function addUi(doc) {

    let title = doc.createElement("span");
    title.className = 'selection';
    title.innerHTML = "Favorieten";

    // 1px voor firefox en 6 voor chrome
    let spacer = doc.createElement("div");
    if (isFireFox()) {
        spacer.style.cssText = ("height: 1px;");
    } else {
        spacer.style.cssText = ("height: 6px;");
    }

    let div = doc.createElement("div");
    div.style.cssText = ("display: flex");

    let select = doc.createElement("select");
    select.name = "esr-favorites";
    select.onchange = onSelectFavorite;

    let addFavbtn = doc.createElement("button");
    addFavbtn.innerHTML = "+";
    addFavbtn.title = "Voeg toe aan favorieten";
    addFavbtn.id = "esr-add-favorite";
    addFavbtn.type = "button";
    addFavbtn.style.cssText = "margin-right: 5px;"
    addFavbtn.onclick = onAddFavoriteClick;

    let removeFavbtn = doc.createElement("button");
    removeFavbtn.innerHTML = "-";
    removeFavbtn.title = "Verwijder uit favorieten";
    removeFavbtn.id = "esr-remove-favorite";
    removeFavbtn.type = "button";
    removeFavbtn.style.cssText = "margin-left: 5px;"
    removeFavbtn.onclick = onRemoveFavoriteClick;

    let td = doc.createElement("td");
    td.className = "tabelle";

    td.appendChild(title);
    td.appendChild(doc.createElement("br"));
    td.appendChild(spacer);

    div.appendChild(addFavbtn);
    div.appendChild(select);
    div.appendChild(removeFavbtn);

    td.appendChild(div);

    $('form[name="NavBar"] table tbody tr td:nth-child(3)', doc).after(td);
}

function onAddFavoriteClick() {
    let type = typeSelect.val();
    let element = $("option:selected", elementSelect).text();

    getStorage('esrFavorites').then(function(result) {
        if (result['esrFavorites']) {
            let favorites = result['esrFavorites'];

            // Controleer dat de favorite nog niet bestaat
            let exists = false;
            for (let i = 0; i < favorites.length; i++) {
                if (favorites[i]['type'] === type && favorites[i]['element'] === element) {
                    exists = true;
                    break;
                }
            }

            if (!exists) {
                favorites.push({'type': type, 'element': element})
                setStorage('esrFavorites', favorites);
            }
        } else {
            setStorage('esrFavorites', [{'type': type, 'element': element}]);
        }
        populateFavorites();
    });

    //console.log(type + ' ' + element);
}

function onRemoveFavoriteClick() {
    let selectedText = $("option:selected", favoritesSelect).text();
    let selectedValue = $("option:selected", favoritesSelect).val();
    let type = selectedValue.substr(0, 1);
    let element = selectedText;

    getStorage('esrFavorites').then( function(result) {
        if (result['esrFavorites']) {
            let favorites = result['esrFavorites'];

            // Zoek de index van de geselecteerde favoriet
            let index = -1;
            for (let i = 0; i < favorites.length; i++) {
                if (favorites[i]['type'] === type && favorites[i]['element'] === element) {
                    index = i;
                    break;
                }
            }

            if (index >= 0) {
                favorites.splice(index, 1)
                setStorage('esrFavorites', favorites);
                populateFavorites();
            }
        }
    });
}

function onSelectFavorite(e) {
    let selectedText = $("option:selected", favoritesSelect).text();
    let selectedValue = $("option:selected", favoritesSelect).val();

    let type = selectedValue.substr(0, 1);
    let element = selectedText;

    typeSelect.val(type);
    triggerEvent(navBarDocument, typeSelect, 'change');

    let elements = getOptions($("option", elementSelect));
    let elementValue = elements[selectedText];
    if (elementValue) {
        elementSelect.val(elementValue);
        triggerEvent(navBarDocument, elementSelect, 'change');
    }
}

function populateFavorites() {
    $(favoritesSelect)
        .find('option')
        .remove()
        .end()
        .append('<option value="0" disabled="disabled" selected="selected">Selecteer favoriet</option>')
        .val('0')
    ;

    getStorage('esrFavorites').then(function(result) {
        // Vul de select met opgeslagen favorieten
        if (result['esrFavorites']) {
            let favorites = result['esrFavorites'];

            for (let i = 0; i < favorites.length; i++) {
                let optionValue = favorites[i]['type'] + i;
                let optionText = favorites[i]['element'];

                let option = new Option(optionText, optionValue);
                $(option).html(optionText);
                favoritesSelect.append(option);
            }
        }
    });
}

function getOptions(el) {
    let options = {};
    $(el).each(function() {
        options[$(this).text()] = $(this).val();
    });
    return options;
}

function triggerEvent(doc, el, evtName) {
    let htmlEvent = doc.createEvent("Event");
    htmlEvent.initEvent(evtName, true, true);
    el[0].dispatchEvent(htmlEvent);
}

function onTypeChange(e) {
    setStorage('esrType', e.target.value);
}

function onElementChange(e) {
    let selectedText = $(e.target).find("option:selected").text();
    setStorage('esrElement', selectedText);
}

function onTypeOrElementClick(e) {
    // Reset de favorites select bij een keuze uit een type of element
    // Chrome:
    // e.detail is 0 bij een klik op de dropdown zelf (werkt alleen in chrome)
    //
    // FireFox:
    // e.target is HTMLOptionElement bij klik op select
    // en HTMLOptionElement bij klik op option (firefox)
    let isDropdownClick = false;
    if (isFireFox()) {
        isDropdownClick = e.target.toString().includes("HTMLOptionElement", 0)
    } else {
        isDropdownClick = e.detail === 0;
    }

    if(isDropdownClick) {
        $(favoritesSelect).val(0);
    }
}

function isFireFox() {
    return typeof InstallTrigger !== 'undefined';
}

function getStorage(key) {
    let storageType = getStorageType();

    if (storageType === "EX") {
        return new Promise((resolve) => {
            browser.storage.local.get(key)
                .then(function (result) {
                    resolve(result);
                });
        });
    }

    if (storageType === "GM") {
        return new Promise((resolve) => {
            GM.getValue(key).then(function (result) {
                resolve({[key]: result});
            })
        });
    }

    if (storageType === "TM") {
        return new Promise((resolve) => {
            let result = GM_getValue(key);
            resolve({[key]: result});
        });
    }

}

function setStorage(key, value) {
    let storageType = getStorageType();

    if(storageType === "EX") {
        browser.storage.local.set({[key]: value});
    }

    if(storageType === "GM") {
        GM.setValue(key, value);
    }

    if(storageType === "TM") {
        GM_setValue(key, value);
    }
}

function getStorageType() {
    if (storageType !== undefined) {
        return storageType;
    }

    storageType = "";
    try {
        GM.setValue("test", "true");
        GM.deleteValue("test");
        storageType = "GM";
    } catch(e) {
        storageType = "";
    }

    if (storageType === "") {
        try {
            GM_setValue("test", "true");
            GM_deleteValue("test");
            storageType = "TM";
        } catch(e) {
            storageType = "";
        }
    }

    if (storageType === "") {
        try {
            browser.storage.local.set({test: "test"})
            browser.storage.local.remove("test");
            storageType = "EX";
        } catch(e) {
            storageType = "";
        }
    }
    return storageType;
}