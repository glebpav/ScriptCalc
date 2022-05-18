let addScriptFormBlock = `
        <form onsubmit="onMakeScript(); return false;" enctype="multipart/form-data">
        
                <p class="title">Type of the Script</p>
                
                <div id="IdScriptHolder" style="width: 71%; margin: 0 auto;">
                
                <div id="scriptTypeWrapper" class="headersRow"  >
                
                <div class="rowWithSpace typeSwitcher" style="width: 49%; margin-right: 5px;" onclick="onScrTypeClicked(0)"
                    id="exeScrTypeTab">
                <p style="margin-top: 5px;">Executable</p>
                </div>
                
                <div class="rowWithSpace typeSwitcher" style="width: 49%; margin-left: 5px;" onclick="onScrTypeClicked(1)"
                    id="serScrTypeTab">
                <p style="margin-top: 5px;">Serviced</p>
                </div>
                
                </div>
                
                <div id="helperInfoWrapper" class="container" style="margin-top: 10px; font-size: 14px;">
                
                </div>
                
                </div>
                
                <div id="scriptDescriptionHolder">
                
                </div>
                
                <div id="fileBlock" >
                
                    <p class="titles">Attach script.py</p>
                    <input type='file' name="file" id="getFile">
                
                <br>
                
                <input type="submit" class="btn-grad" value="Create script">

                </div>                            
        
        </form>
        `;

let exeScriptBlock = `
        <input type="hidden" name="type" style="font-size: 14px;" value="executable">
        <input id="scriptName" class="enterText" style="margin-top: 40px; font-size: 14px;" name="name" placeholder="Name of your script">
        <textarea id="scriptDescription" name="description" class="enterText"
              placeholder="Put here your wonderful description"></textarea>
        
        <p class="titles">Input params</p>
        <div id="inputParams">
        <div class="row" id="row0">
            <input class="middleWidthBlock enterText" name="inputParams[0]" placeholder="Param"/>
            <input class="middleWidthBlock enterText" name="inputParamsUnits[0]" style="width: 40px" placeholder="Units"/>
        </div>
        </div>
        
        <div id="inputParamsButtons">
        
        
                <hr style="width: 250px; background: #e0e5ff"/>
        
                <button id="btnAddMoreInpParams" class="addBtn" onclick="onAddMoreParams(&quot;inp&quot;); return false;">Add more
                </button>
                <button id="btnDelLastInpParams" class="delBtn" onclick="onDelLastParam(&quot;inp&quot;); return false;">del
                </button>
        </div>
        <p class="titles" align="middle" style="margin-top: 30px;">Output params</p>
        
        <div id="outputParams">
        <div class="row" id="row2">
            <input class="middleWidthBlock enterText" name="outputParams[0]" placeholder="Param"/>
            <input class="middleWidthBlock enterText" name="outputParamsUnits[0]" style="width: 40px" placeholder="Units"/>
        </div>
        </div>
        
        <div id="outputParamsButtons">
        
                <hr style="width: 250px;  background: #e0e5ff"/>
                
                <button id="btnAddMoreOutParams" class="addBtn" onclick="onAddMoreParams(&quot;out&quot;); return false;">Add more
                </button>
                <button id="btnDelLastOutParams" class="delBtn" onclick="onDelLastParam(&quot;out&quot;); return false;">del
                </button>
        
        </div>
        <br>
`

let serScriptBlock = `
        <input type="hidden" name="type" value="serviced">
        <input id="scriptName" class="enterText" style="margin-top: 40px;" name="name" placeholder="Name of your script">
        <textarea id="scriptDescription" name="description" class="enterText"
        placeholder="Put here your wonderful description"></textarea>
`