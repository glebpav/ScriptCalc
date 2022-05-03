let addScriptFormBlock = `
            <form onsubmit="onMakeScript(); return false;" enctype="multipart/form-data">

            <input id="scriptName" class="enterText" name="name" placeholder="Name of your script">

            <textarea id="scriptDescription" name="description" class="enterText"
                      placeholder="Put here your wonderful description"></textarea>

            <p class="titles">Input params</p>
            <div id="inputParams">
                <div class="row" id="row0">
                    <input class="block enterText" name="inputParams[0]" placeholder="Param"/>
                    <input class="block enterText" name="inputParamsUnits[0]" style="width: 40px" placeholder="Units"/>
                </div>
            </div>

            <hr style="width: 160px; background: #e0e5ff"/>

            <button id="btnAddMoreInpParams" class="addBtn" onclick="onAddMoreParams(&quot;inp&quot;); return false;">Add more
            </button>
            <button id="btnDelLastInpParams" class="delBtn" onclick="onDelLastParam(&quot;inp&quot;); return false;">del
            </button>

            <p class="titles" align="middle" style="margin-top: 30px;">Output params</p>

            <div id="outputParams">
                <div class="row" id="row2">
                    <input class="block enterText" name="outputParams[0]" placeholder="Param"/>
                    <input class="block enterText" name="outputParamsUnits[0]" style="width: 40px" placeholder="Units"/>
                </div>
            </div>

            <hr style="width: 160px;  background: #e0e5ff"/>

            <button id="btnAddMoreOutParams" class="addBtn" onclick="onAddMoreParams(&quot;out&quot;); return false;">Add more
            </button>
            <button id="btnDelLastOutParams" class="delBtn" onclick="onDelLastParam(&quot;out&quot;); return false;">del
            </button>
            <br>

            <p class="titles">Attach script.py</p>
            <input type='file' name="file" id="getFile">

            <br>

            <input type="submit" class="btn-grad" value="Create script">

        </form>
        `;
