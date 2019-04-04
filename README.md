# Software Studio 2018 Spring Assignment 01 Web Canvas

## Web Canvas
<img src="example01.gif" width="700px" height="500px"></img>

## Todo
1. **Fork the repo ,remove fork relationship and change project visibility to public.**
2. Create your own web page with HTML5 canvas element where we can draw somethings.
3. Beautify appearance (CSS).
4. Design user interaction widgets and control tools for custom setting or editing (JavaScript).
5. **Commit to "your" project repository and deploy to Gitlab page.**
6. **Describing the functions of your canvas in REABME.md**

## Scoring (Check detailed requirments via iLMS)

| **Item**                                         | **Score** |
| :----------------------------------------------: | :-------: |
| Basic components                                 | 60%       |
| Advance tools                                    | 35%       |
| Appearance (subjective)                          | 5%        |
| Other useful widgets (**describe on README.md**) | 1~10%     |

## Reminder
* Do not make any change to our root project repository.
* Deploy your web page to Gitlab page, and ensure it works correctly.
    * **Your main page should be named as ```index.html```**
    * **URL should be : https://[studentID].gitlab.io/AS_01_WebCanvas**
* You should also upload all source code to iLMS.
    * .html or .htm, .css, .js, etc.
    * source files
* **Deadline: 2018/04/05 23:59 (commit time)**
    * Delay will get 0 point (no reason)
    * Copy will get 0 point
    * "屍體" and 404 is not allowed

---

## Put your report below here

## Basic Function
1. Basic control tools (30%)

    - **Brush**: Click <img src="https://i.imgur.com/QafeBm8.png" width="30px" height="30px"> in the left toolbar to select the brush.
    - **Eraser**: Click <img src="https://i.imgur.com/iZ12cAA.png" width="30px" height="30px"> in the left toolbar to select the eraser. It is a **real eraser**, not a liquid paper or correction tape. It wipes canvas transparent rather than white.
    - Click on the <img src="https://i.imgur.com/QafeBm8.png" width="30px" height="30px"> or <img src="https://i.imgur.com/iZ12cAA.png" width="30px" height="30px"> to show or hide slider for stroke size. If it doesn't work, click again.
   - **Color selector**:
        - The color selector is in the right panel.
        - Click on the rainbow stripe to select color, then click on the gradient to choose brightness and saturation.
        - A slidebar to adjust transparency.
    
2. **Text input** (10%)
    - Click <img src="https://i.imgur.com/TuPF0cT.png" width="30px" height="30px"> in the left toolbar to select the text tool, then click on where you want to type in the canvas and start typing.
    - Font menu (typeface and size): Click on the <img src="https://i.imgur.com/TuPF0cT.png" width="30px" height="30px"> to show or hide font menu. If it doesn't work, click again.

3. Cursor icon (10%)
    - Custom cursor: brush <img src="https://i.imgur.com/QafeBm8.png" width="30px" height="30px">, eraser <img src="https://i.imgur.com/iZ12cAA.png" width="30px" height="30px">
    - New (4/5): text tool <img src="https://i.imgur.com/TuPF0cT.png" width="30px" height="30px">
    - Icons are from: www.flaticon.com
    
4. **Refresh button** (10%)
    - Reset canvas: Click on the <img src="https://i.imgur.com/qEHbevv.png" width="30px" height="30px"> in the left toolbar to reset canvas. All the newly added layers will be deleted. 

## Advance Tools

5. Different brush shapes (15%)
    - Click on the <img src="https://i.imgur.com/8P3ibHc.png" width="30px" height="30px"> in the left toolbar to toggle menu. Then, select the shape you want.
    - **Rectangle**: click and drag to draw a rectangle
    - **Circle**: click to set the center of circle, then drag to adjust its size.
    - **Triangle**: Click to set the vertex of the triangle. Then drag to set another vertex. An isosceles triangle will be created.
    - The shape are filled with the currently chosen color.

6. **Un/Re-do** button (10%)
    - Click on the <img src="https://i.imgur.com/cVx8BqS.png" width="30px" height="30px"> button in the left toolbar to undo last step. 
    - Click again to redo.
    
7. **Image tool** (5%)
    - Upload: Click on the <img src="https://i.imgur.com/Dn7e4uL.png" width="30px" height="30px"> button to open a file browser and choose an image.
    - Paste: A <img src="https://i.imgur.com/kMPzqLt.png" width="30px" height="30px"> cursor will appear. Click on the canvas to paste the image in the desired position.

8. **Download** (5%)
    - Click on the <img src="https://i.imgur.com/iXtklrn.png" width="30px" height="30px"> to download current layer as png file.

## Other useful widgets

9. **Layer tools**
    - There are only 1 layer by default. Click the '+ New Layer' to add new layers. 
    - You can switch to other layers from the layer selector, or simply by clicking the mini view of the layer.
    - Toggle the visibility of the layers by clicking the check box. 

10. **Selection tools**
    - Select the layer you want then click on <img src="https://i.imgur.com/vOA7l7q.png" width="30px" height="30px"> to draw selection area. 
    - **Delete**: Click the <img src="https://i.imgur.com/u0PN1ar.png" width="30px" height="30px"> button to clear the selected area. If no area is selected, the whole canvas will be cleared.
    - **Cut, copy**: Select the <img src="https://i.imgur.com/Pcx14Uh.png" width="30px" height="30px"> to cut, or select the <img src="https://i.imgur.com/oEcvigX.png" width="30px" height="30px"> to copy the selected area. 
    - **Paste**: A <img src="https://i.imgur.com/kMPzqLt.png" width="30px" height="30px"> cursor will appear. Click on the canvas to paste the selected area in the desired position.
    - If no area is selected, then whole canvas will be copied. 

11. **Paint bucket**
    - Click on the <img src="https://i.imgur.com/UsxqNFi.png" width="30px" height="30px"> in the left toolbar to fill the whole canvas with choosen color. 
    - If selection tool is being used, only the area selected will bw filled.

12. **History panel**
    - There is a 'History' panel in the bottom right corner to view the last state.