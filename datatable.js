class FirebaseDataTable{


    constructor(containerID)
    {
        let objName = "dataTableExample";
        // language=HTML
        let dialogs = "\n" +
            "<div class=\"modal fade\" id=\"addRowModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"addRowModalTitle\" aria-hidden=\"true\">\n" +
            "    <div class=\"modal-dialog modal-sm\" role=\"document\">\n" +
            "        <div class=\"modal-content\">\n" +
            "            <div class=\"modal-header\">\n" +
            "                <h5 class=\"modal-title\" id=\"addRowModalTitle\">CREATE SOUND</h5>\n" +
            "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                    <span aria-hidden=\"true\">&times;</span>\n" +
            "                </button>\n" +
            "            </div>\n" +
            "            <div class=\"modal-body\">\n" +
            "                <div class=\"\">\n" +
            "                    <label for=\"soundNameCreateInput\">NAME</label>\n" +
            "                    <input required id=\"soundNameCreateInput\" type=\"text\" class=\"form-control\">\n" +
            "                    <label for=\"soundNameCreateInput\">GENRE</label>\n" +
            "                    <input  required id=\"genreCreateInput\" type=\"text\" class=\"form-control\">\n" +
            "                    <label for=\"soundNameCreateInput\">NUMBER OF AUDITIONS</label>\n" +
            "                    <input required id=\"numberOfAuditionsCreateInput\" type=\"number\" class=\"form-control\">\n" +
            "                    <label for=\"soundNameCreateInput\">AUTHOR</label>\n" +
            "                    <input required id=\"authorCreateInput\" type=\"text\" class=\"form-control\">\n" +
            "                </div>\n" +
            "            </div>\n" +
            "            <div class=\"modal-footer\">\n" +
            "                <button id=\"closeAddRowModal\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Close</button>\n" +
            "                <button type=\"button\" class=\"btn btn-primary\" onclick=\"onClickCreateSound('"+objName+"')\">Create</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "<div class=\"modal fade\" id=\"deleteRowsModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"deleteRowsModalTitle\" aria-hidden=\"true\">\n" +
            "    <div class=\"modal-dialog modal-sm\" role=\"document\">\n" +
            "        <div class=\"modal-content\">\n" +
            "            <div class=\"modal-header\">\n" +
            "                <h5 class=\"modal-title\" id=\"deleteRowsModalTitle\">DELETE SOUND</h5>\n" +
            "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                    <span aria-hidden=\"true\">&times;</span>\n" +
            "                </button>\n" +
            "            </div>\n" +
            "            <div class=\"modal-body\">\n" +
            "                Are you sure you want to delete sounds?\n" +
            "            </div>\n" +
            "            <div class=\"modal-footer\">\n" +
            "                <button id=\"closeDeleteRowsModalModal\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancel</button>\n" +
            "                <button type=\"button\" class=\"btn btn-danger\" onclick=\"onClickDeleteSound('"+objName+"')\">Yes</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "<div class=\"modal fade\" id=\"updateRowModal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"updateRowModalTitle\" aria-hidden=\"true\">\n" +
            "    <div class=\"modal-dialog modal-sm\" role=\"document\">\n" +
            "        <div class=\"modal-content\">\n" +
            "            <div class=\"modal-header\">\n" +
            "                <h5 class=\"modal-title\" id=\"updateRowModalTitle\">UPDATE SOUND</h5>\n" +
            "                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n" +
            "                    <span aria-hidden=\"true\">&times;</span>\n" +
            "                </button>\n" +
            "            </div>\n" +
            "            <div class=\"modal-body\">\n" +
            "                <label for=\"soundNameCreateInput\">NAME</label>\n" +
            "                <input required id=\"soundNameUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "                <label for=\"soundNameCreateInput\">GENRE</label>\n" +
            "                <input  required id=\"genreUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "                <label for=\"soundNameCreateInput\">NUMBER OF AUDITIONS</label>\n" +
            "                <input required id=\"numberOfAuditionsUpdateInput\" type=\"number\" class=\"form-control\">\n" +
            "                <label for=\"soundNameCreateInput\">AUTHOR</label>\n" +
            "                <input required id=\"authorUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "                <input hidden required id=\"keyUpdateInput\" type=\"text\" class=\"form-control\">\n" +
            "\n" +
            "            </div>\n" +
            "            <div class=\"modal-footer\">\n" +
            "                <button id=\"closeUpdateRowModal\" type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancel</button>\n" +
            "                <button type=\"button\" class=\"btn btn-primary\" onclick=\"onClickUpdateSaveSound('"+objName+"')\">Save</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "\n" +
            "\n" +
            "\n";
        let thisObj = this;
        this.containerID = containerID;
        $("html").append(dialogs);
        this.db = firebase.database();
        this.allSounds = [];
        this.displaySounds = [];
        this.sortField = null;
        this.isDescSort = false;
        this.filter = '';
        this.currentPage = 0;
        this.displayPagesCount = 0;
        this.rowsOnPage = 5;
        this.maxDisplayPages = 10;

        this.soundFields = ['soundName','genre','author','numberOfAuditions'];

        this.soundRef = this.db.ref('sound');
        this.createInputSoundName = $('#soundNameCreateInput');
        this.createInputGenre = $('#genreCreateInput');
        this.createInputNumberOfAuditions = $('#numberOfAuditionsCreateInput');
        this.createInputAuthor = $('#authorCreateInput');

        this.updateInputSoundName = $('#soundNameUpdateInput');
        this.updateInputGenre = $('#genreUpdateInput');
        this.updateInputNumberOfAuditions = $('#numberOfAuditionsUpdateInput');
        this.updateInputAuthor = $('#authorUpdateInput');
        this.updateInputKey = $('#keyUpdateInput');

        this.soundRef.on('child_added', function(data) {
            let newSound = data.val();
            newSound.key = data.key;
            thisObj.allSounds.push(newSound);
            thisObj.refresh();
        });

        this.soundRef.on('child_changed', function(data) {
            let newSound = data.val();
            newSound.key = data.key;
            let foundIndex = thisObj.allSounds.findIndex(function (item) {
                return item.key === data.key;
            });
            if(foundIndex !== -1)
            {
                thisObj.allSounds[foundIndex] = newSound;
            }
            thisObj.refresh();
        });

        this.soundRef.on('child_removed', function(data) {
            thisObj.allSounds = thisObj.allSounds.filter(function(item){
                return item.key !== data.key;
            });
            thisObj.refresh();
        });


        this.filterBy();
        this.sortByField();
        this.renderWidget();
    }

    createSound(soundName, genre, numberOfAuditions, author) {
        let newUser = {
            soundName : soundName,
            genre: genre,
            numberOfAuditions : numberOfAuditions,
            author: author
        };
        this.db.ref('sound').push(newUser);
    }

    updateSound(key,soundName, genre, numberOfAuditions, author)
    {
        let newUser = {
            soundName : soundName,
            genre: genre,
            numberOfAuditions : numberOfAuditions,
            author: author
        };

        this.db.ref('sound/'+key).set(newUser);
    }


    deleteSound(key)
    {
        this.db.ref('sound/'+key).remove();
    }

    renderWidget()
    {
        let objectName = "dataTableExample";
        let container = $(this.containerID);
        container.html('');
        let searchDiv = $('<div class="form-group row" style="margin: 20px 0 10px 10px;">');
        searchDiv.append('<label for="searchInput" class="col-form-label">Search</label>');
        searchDiv.append(
            $('<div class="col-sm-11">').append(
                $('<input id="searchInput" class="form-control col-md-12" onchange="onClickFilter(\''+objectName+'\');">').val(this.filter)
            )
        );

        container.append(searchDiv);


        container.append($('<div>').text('Rows: ' + this.displaySounds.length));
        let tableHtml = $('<table class="table table-striped" style="background-color: #fcfcfc">');
        //headers
        let header = $('<tr>');
        header.append($('<th>').html('<i class="fas fa-trash"></i>'));
        header.append($('<th>').text('№'));
        for(let i =0;i<this.soundFields.length;i++)
        {
            let a = $('<a href="#">').click({param1:objectName},onClickSortByField).text(this.soundFields[i]);
            if(this.soundFields[i] === this.sortField)
            {
                a = $('<b>').append(a).append(this.isDescSort?' <i class="fas fa-long-arrow-alt-down"></i>':' <i class="fas fa-long-arrow-alt-up"></i>');
            }else{
                a = $('<span>').append(a).append(' <i class="fas fa-arrows-alt-v" style="color: rgba(133,133,133,0.31)"></i>');
            }
            header.append($('<th>').append(a))
        }
        header.append($('<th>').html('<i class="fas fa-edit"></i>'));

        tableHtml.append(header);

        //table data
        let firstDisplayI = (this.currentPage) * this.rowsOnPage;
        let lastDisplayI = ((this.currentPage) * this.rowsOnPage + this.rowsOnPage < this.displaySounds.length)? (this.currentPage) * this.rowsOnPage + this.rowsOnPage: this.displaySounds.length;
        for(let i =  firstDisplayI;i<lastDisplayI;i++)
        {
            let rowHtml = $('<tr>');
            rowHtml.append($('<td>').html('<input type="checkbox" name="type" value="'+this.displaySounds[i].key+'" />'));
            rowHtml.append($('<td>').text(i));
            for(let j =0;j<this.soundFields.length;j++)
            {
                rowHtml.append(
                    $('<td>').text(this.displaySounds[i][this.soundFields[j]])
                );
            }
            rowHtml.append($('<td>').append($('<a href="#" class="fas fa-pen">').click({param1:i,param2:objectName},onClickUpdateSound)));
            rowHtml.append( $('<td id="key' + i + '" hidden>').text(this.displaySounds[i].key));
            tableHtml.append(rowHtml);
        }
        container.append(tableHtml);
        //pages buttons
        let pagination = $('<div class="col-md-6" style="margin: 10px; float: left;">');
        let allPagesCount = Math.ceil((this.displaySounds.length ) / this.rowsOnPage);
        this.displayPagesCount = (allPagesCount > this.maxDisplayPages)? this.maxDisplayPages : allPagesCount;
        let firstDisplayPage = 0;
        let lastDisplayPage = this.displayPagesCount;
        if(allPagesCount > this.maxDisplayPages)
        {
            if(this.currentPage - Math.trunc(this.maxDisplayPages/2) < 0)
            {
                firstDisplayPage = 0;
                lastDisplayPage = this.maxDisplayPages;
            }
            else if(this.currentPage + Math.trunc(this.maxDisplayPages/2) > allPagesCount)
            {
                firstDisplayPage = allPagesCount - 10;
                lastDisplayPage = allPagesCount;
            }else{
                firstDisplayPage = this.currentPage - Math.trunc(this.maxDisplayPages/2);
                lastDisplayPage = this.currentPage + Math.trunc(this.maxDisplayPages/2);
            }
        }

        for(let i = firstDisplayPage;i<lastDisplayPage;i++)
        {
            let enable = 'enable';
            if(i === this.currentPage)
                enable = 'disabled';
            let button = $('<button ' + enable +' class="btn btn-sm btn-outline-primary" style="margin: 2px 10px 10px 0; width: 40px; height: 40px;">').text(i+1);
            button.click({param1:objectName},onSwitchPageClick);
            pagination.append(button);
        }
        container.append(pagination);
        //control buttons
        let controlPanel = $('<div style="margin: 10px 20px 10px 20px; float: right;">');
        controlPanel.append($('<button  type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#addRowModal">').text('Create'));
        controlPanel.append($('<button class="btn btn-outline-danger" data-toggle="modal" data-target="#deleteRowsModal" style=" margin-left: 10px ;">').text('Delete Selected'));
        controlPanel.append($('<button class="btn btn-outline-info" style=" margin-left: 10px ;">').text('Refresh').click(function (objName) {window[objName].refresh();}));
        controlPanel.append($('<button hidden id="updateButton" data-toggle="modal" data-target="#updateRowModal">').text('Update'));
        container.append(controlPanel);

    }
    refresh() {
        this.filterBy();
        this.sortByField();
        this.renderWidget();
    }

    sortByField()
    {
        if(this.sortField !== null)
        {
            if(typeof this.allSounds[0][this.sortField] === "number")
            {
                if(this.isDescSort)
                {
                    this.displaySounds = this.displaySounds.sort((a,b) =>{
                        return a[this.sortField] - b[this.sortField];
                    });
                }else{
                    this.displaySounds = this.displaySounds.sort((a,b) => {
                        return b[this.sortField] - a[this.sortField];
                    });
                }

            }else{
                if(this.isDescSort)
                {
                    this.displaySounds = this.displaySounds.sort((a,b) => {
                        return -a[this.sortField].localeCompare(b[this.sortField])
                    });
                }else{
                    this.displaySounds = this.displaySounds.sort( (a,b)=>{

                        return a[this.sortField].localeCompare(b[this.sortField])
                    });
                }

            }

        }
    }

    filterBy()
    {
        if(this.filter !== '')
        {
            this.displaySounds = this.allSounds.filter( (value)=>{
                return value.author.indexOf(this.filter) !== -1
                    || value.soundName.indexOf(this.filter) !== -1
                    || value.genre.indexOf(this.filter) !== -1
                    || (value.numberOfAuditions+'').indexOf(this.filter) !== -1
            });
        }else
            this.displaySounds = this.allSounds.slice(0);
    }
}

function onSwitchPageClick(objName)
{
    let datatableonj = window[objName.data.param1];
    datatableonj.currentPage = parseInt(this.innerText) - 1;
    console.log(this);
    datatableonj.renderWidget();
}

function onClickFilter(objName)
{
    let datatableonj = window[objName];
    datatableonj.filter = $('#searchInput').val();
    console.log(datatableonj.filter);
    datatableonj.filterBy();
    datatableonj.renderWidget();
}
function onClickSortByField(objName)
{
    let datatableonj = window[objName.data.param1];
    let oldSortField = datatableonj.sortField;
    datatableonj.sortField = this.innerText;
    if(oldSortField === datatableonj.sortField) {
        datatableonj.isDescSort = !datatableonj.isDescSort;
    }else{
        datatableonj.isDescSort = false;
    }
    datatableonj.sortByField();
    datatableonj.renderWidget();
}

function onClickCreateSound(objName)
{
    let datatableonj = window[objName];
    let soundName = datatableonj.createInputSoundName.val();
    let genre = datatableonj.createInputGenre.val();
    let numberOfAuditions = datatableonj.createInputNumberOfAuditions.val();
    let author = datatableonj.createInputAuthor.val();
    if(soundName === '' || genre === '' || numberOfAuditions === '' || author === '')
        return;
    datatableonj.createSound(soundName,genre,parseInt(numberOfAuditions),author);

    $('#closeAddRowModal').click();

    datatableonj.createInputSoundName.val('');
    datatableonj.createInputGenre.val('');
    datatableonj.createInputNumberOfAuditions.val('');
    datatableonj.createInputAuthor.val('');

}

function onClickDeleteSound(objName) {
    let datatableonj = window[objName];
    let selected = [];

    $("input:checkbox[name=type]:checked").each(function() {
        selected.push($(this).val());
    });
    selected.forEach(function (value) {
        datatableonj.deleteSound(value);
    });
    $('#closeDeleteRowsModalModal').click();
}

function onClickUpdateSound(event) {
    let index = event.data.param1;
    let datatableonj = window[event.data.param2];
    $('#updateButton').click();
    datatableonj.updateInputSoundName.val(datatableonj.displaySounds[index].soundName);
    datatableonj.updateInputGenre.val(datatableonj.displaySounds[index].genre);
    datatableonj.updateInputNumberOfAuditions.val(datatableonj.displaySounds[index].numberOfAuditions);
    datatableonj.updateInputAuthor.val(datatableonj.displaySounds[index].author);
    datatableonj.updateInputKey.val(datatableonj.displaySounds[index].key);
}

function onClickUpdateSaveSound(objName) {
    let datatableonj = window[objName];
    let soundName = datatableonj.updateInputSoundName.val();
    let genre = datatableonj.updateInputGenre.val();
    let numberOfAuditions = datatableonj.updateInputNumberOfAuditions.val();
    let author = datatableonj.updateInputAuthor.val();
    let key = datatableonj.updateInputKey.val();

    if(soundName === '' || genre === '' || numberOfAuditions === '' || author === '')
        return;
    console.log(parseInt(numberOfAuditions));
    datatableonj.updateSound(key,soundName,genre,parseInt(numberOfAuditions),author);

    $('#closeUpdateRowModal').click();

    datatableonj.updateInputSoundName.val('');
    datatableonj.updateInputGenre.val('');
    datatableonj.updateInputNumberOfAuditions.val('');
    datatableonj.updateInputAuthor.val('');
}