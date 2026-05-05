/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const def = {
    paintStyle: {
        lineWidth: 2,
        strokeStyle: "#94a3b8",
        outlineColor: "rgba(15, 23, 42, 0.18)",
        outlineWidth: 1.5,
        lineCap: "round",
        lineJoin: "round"
    },
    connectorPaintStyle: {
        lineWidth: 2
    },
    anchor: "AutoDefault",
    detachable: false,
    endpointStyle: {
        fillStyle: "#cbd5e1",
        outlineColor: "rgba(15, 23, 42, 0.18)",
        outlineWidth: 1,
        radius: 3
    }
};

const failedConnectorStyle = {
    lineWidth: 2,
    strokeStyle: "rgba(148, 163, 184, 0.55)",
    outlineColor: "rgba(15, 23, 42, 0.18)",
    outlineWidth: 1.5
};

const failedConnectorHoverStyle = {
    strokeStyle: "#FFFFFF"
};

const failedEndpointStyle = {
    fillStyle: "rgba(148, 163, 184, 0.45)",
    outlineColor: "rgba(15, 23, 42, 0.18)",
    outlineWidth: 1,
    radius: 3
};

const disabledConnectorStyle = {
    lineWidth: 2,
    strokeStyle: "#fb7185",
    outlineColor: "rgba(15, 23, 42, 0.18)",
    outlineWidth: 1.5
};

const disabledConnectorHoverStyle = {
    strokeStyle: "#FF8C00"
};

const disabledEndpointStyle = {
    fillStyle: "rgba(251, 113, 133, 0.8)",
    outlineColor: "rgba(15, 23, 42, 0.18)",
    outlineWidth: 1,
    radius: 3
};

const enabledConnectorStyle = {
    lineWidth: 2,
    strokeStyle: "#22c55e",
    outlineColor: "rgba(15, 23, 42, 0.18)",
    outlineWidth: 1.5
};

const enabledConnectorHoverStyle = {
    strokeStyle: "#16a34a"
};

const enabledEndpointStyle = {
    fillStyle: "rgba(34, 197, 94, 0.35)",
    outlineColor: "rgba(15, 23, 42, 0.18)",
    outlineWidth: 1,
    radius: 3
};

window.disable = function (targetName) {
    jsPlumb.ready(function () {
        jsPlumb.select({target: targetName}).setPaintStyle(disabledConnectorStyle).setHoverPaintStyle(disabledConnectorHoverStyle);
        jsPlumb.selectEndpoints({element: [targetName]}).setPaintStyle(disabledEndpointStyle);
    });
}

window.enable = function (targetName) {
    jsPlumb.ready(function () {
        jsPlumb.select({target: targetName}).setPaintStyle(enabledConnectorStyle).setHoverPaintStyle(enabledConnectorHoverStyle);
        jsPlumb.selectEndpoints({element: [targetName]}).setPaintStyle(enabledEndpointStyle);
    });
}

window.failure = function (targetName) {
    jsPlumb.ready(function () {
        jsPlumb.select({target: targetName}).setPaintStyle(failedConnectorStyle).setHoverPaintStyle(failedConnectorHoverStyle);
        jsPlumb.selectEndpoints({element: [targetName]}).setPaintStyle(failedEndpointStyle);
    });
}

window.unknown = function (targetName) {
}

function getTopology() {
    const topology = $.cookie("topology");
    let val;
    if (topology == null) {
        val = {};
    } else {
        val = JSON.parse(decodeURIComponent(topology));
    }

    return val;
}

window.refreshPosition = function (element) {
    const val = getTopology();

    const id = $(element).attr('id');
    const left = $(element).css('left');
    const top = $(element).css('top');

    if (val[id] == null) {
        val[id] = {'top': top, 'left': left};
    } else {
        val[id].top = top;
        val[id].left = left;
    }

    $.cookie("topology", JSON.stringify(val), {expires: 9999});
}

window.setPosition = function (id, x, y) {
    const val = getTopology();

    try {
        // We cannot use jQuery selector for id since the syntax of connector server id
        const element = $(document.getElementById(id));

        if (val[id] == null) {
            element.css("left", x + "px");
            element.css("top", y + "px");
        } else {
            element.css("left", val[id].left);
            element.css("top", val[id].top);
        }
    } catch (err) {
        console.log("Failure setting position for ", id);
    }
}

window.setZoom = function (el, zoom, instance, transformOrigin) {
    transformOrigin = transformOrigin || [0.5, 0.5];
    instance = instance || jsPlumb;
    el = el || instance.getContainer();

    const p = ["webkit", "moz", "ms", "o"],
        s = "scale(" + zoom + ")",
        oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

    for (let i = 0; i < p.length; i++) {
        el.style[p[i] + "Transform"] = s;
        el.style[p[i] + "TransformOrigin"] = oString;
    }

    el.style["transform"] = s;
    el.style["transformOrigin"] = oString;

    instance.setZoom(zoom);
};

window.zoomIn = function (el, instance, transformOrigin) {
    const val = getTopology();
    let zoom;
    if (val.__zoom__ == null) {
        zoom = 0.69;
    } else {
        zoom = val.__zoom__ + 0.01;
    }

    setZoom(el, zoom, instance, transformOrigin);

    val['__zoom__'] = zoom;
    $.cookie("topology", JSON.stringify(val), {expires: 9999});
};

window.zoomOut = function (el, instance, transformOrigin) {
    const val = getTopology();
    let zoom;
    if (val.__zoom__ == null) {
        zoom = 0.67;
    } else {
        zoom = val.__zoom__ - 0.01;
    }

    setZoom(el, zoom, instance, transformOrigin);

    val['__zoom__'] = zoom;
    $.cookie("topology", JSON.stringify(val), {expires: 9999});
};

window.connect = function (source, target, scope) {
    jsPlumb.ready(function () {
        if (jsPlumb.select({source: source, target: target, scope: scope}) != null) {
            jsPlumb.connect({source: source, target: target, scope: scope}, def);
        }
    });
}

window.activate = function (zoom) {
    jsPlumb.ready(function () {
        jsPlumb.draggable(jsPlumb.getSelector(".window"));
        jsPlumb.setContainer("drawing");

        jsPlumb.Defaults.MaxConnections = 1000;

        (function initTopologyPanning() {
            const $topology = $("#topology");
            const $drawing = $("#drawing");
            if ($topology.length === 0 || $drawing.length === 0) {
                return;
            }

            $topology.off(".topopanning");
            $(document).off(".topopanning");

            let dragging = false;
            let startX = 0;
            let startY = 0;
            let startLeft = 0;
            let startTop = 0;

            function panBlocked(target) {
                return $(target).closest(".window, ._jsPlumb_connector, ._jsPlumb_endpoint, ._jsPlumb_overlay").length > 0;
            }

            $topology.on("mousedown.topopanning", function (e) {
                if (e.button !== 0) {
                    return;
                }
                if (panBlocked(e.target)) {
                    return;
                }

                dragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = topologyParsePx($drawing.css("left"), 0);
                startTop = topologyParsePx($drawing.css("top"), 0);
                $topology.addClass("topology-panning");
                e.preventDefault();
            });

            $(document).on("mousemove.topopanning", function (e) {
                if (!dragging) {
                    return;
                }
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                $drawing.css("left", (startLeft + dx) + "px");
                $drawing.css("top", (startTop + dy) + "px");
            });

            $(document).on("mouseup.topopanning", function () {
                if (!dragging) {
                    return;
                }
                dragging = false;
                $("#topology").removeClass("topology-panning");
                jsPlumb.repaintEverything();
            });
        })();

        const val = getTopology();
        if (val.__zoom__ == null) {
            setZoom($("#drawing")[0], zoom);
        } else {
            setZoom($("#drawing")[0], val.__zoom__);
        }
    });
}

window.checkConnection = function () {
    jsPlumb.ready(function () {
        const items = [];

        jsPlumb.select({scope: "CONNECTOR"}).each(function (connection) {
            const id = connection && connection.target ? connection.target.id : null;
            if (id) {
                items.push({kind: "CHECK_CONNECTOR", id: id, conn: connection});
            }
        });
        jsPlumb.select({scope: "RESOURCE"}).each(function (connection) {
            const id = connection && connection.target ? connection.target.id : null;
            if (id) {
                items.push({kind: "CHECK_RESOURCE", id: id, conn: connection});
            }
        });

        window.__topologyCheckRunId = (window.__topologyCheckRunId || 0) + 1;
        const runId = window.__topologyCheckRunId;

        const batchSize = 25;
        let idx = 0;

        function step() {
            if (window.__topologyCheckRunId !== runId) {
                return;
            }
            const end = Math.min(idx + batchSize, items.length);

            if (jsPlumb.setSuspendDrawing) {
                jsPlumb.setSuspendDrawing(true);
            }
            try {
                for (let i = idx; i < end; i++) {
                    const it = items[i];
                    if (it.conn) {
                        it.conn.setPaintStyle(def.paintStyle);
                    }
                    jsPlumb.selectEndpoints({element: [it.id]}).setPaintStyle(def.endpointStyle);

                    Wicket.WebSocket.send("{ \"kind\":\"" + it.kind + "\", \"target\":\"" + it.id + "\" }");
                }
            } finally {
                if (jsPlumb.setSuspendDrawing) {
                    jsPlumb.setSuspendDrawing(false, true);
                } else {
                    jsPlumb.repaintEverything();
                }
            }

            idx = end;
            if (idx < items.length) {
                window.setTimeout(step, 0);
            }
        }

        step();
    });
}

window.addEndpoint = function (source, target, scope) {
    const sourceElement = $(document.getElementById(source));

    const top = parseFloat(sourceElement.css("top")) + 10;
    const left = parseFloat(sourceElement.css("left")) - 150;

    setPosition(target, left, top);
    jsPlumb.ready(function () {
        jsPlumb.draggable(jsPlumb.getSelector(document.getElementById(target)));
        jsPlumb.connect({source: source, target: target, scope: scope}, def);
    });
}

function topologyParsePx(val, fallback) {
    if (val == null) {
        return fallback;
    }
    if (typeof val === 'number') {
        return val;
    }
    const n = parseFloat(String(val).replace("px", ""));
    return isNaN(n) ? fallback : n;
}

function topologyUniqPush(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            return;
        }
    }
    arr.push(value);
}

function topologyBuildChildren(connections) {
    const childrenById = {};
    const indegree = {};
    for (let i = 0; i < connections.length; i++) {
        const c = connections[i];
        if (!c || !c.source || !c.target) {
            continue;
        }
        const sourceId = c.source.id;
        const targetId = c.target.id;
        if (!sourceId || !targetId || sourceId === targetId) {
            continue;
        }

        if (!childrenById[sourceId]) {
            childrenById[sourceId] = [];
        }
        topologyUniqPush(childrenById[sourceId], targetId);

        if (indegree[targetId] == null) {
            indegree[targetId] = 1;
        } else {
            indegree[targetId] = indegree[targetId] + 1;
        }
        if (indegree[sourceId] == null) {
            indegree[sourceId] = 0;
        }
    }
    return {childrenById: childrenById, indegree: indegree};
}

function topologyPickRoot(allNodeIds, childrenById, indegree) {
    const rootEl = $("#drawing .window.topology_root")[0];
    if (rootEl && rootEl.id) {
        return rootEl.id;
    }

    for (let i = 0; i < allNodeIds.length; i++) {
        const id = allNodeIds[i];
        if ((indegree[id] == null || indegree[id] === 0) && childrenById[id] && childrenById[id].length > 0) {
            return id;
        }
    }

    return allNodeIds.length > 0 ? allNodeIds[0] : null;
}

function topologyComputeSubtreeWidth(nodeId, childrenById, nodeSizeById, hGap, visiting, memo) {
    if (memo[nodeId] != null) {
        return memo[nodeId];
    }
    if (visiting[nodeId]) {
        memo[nodeId] = nodeSizeById[nodeId] ? nodeSizeById[nodeId].w : 140;
        return memo[nodeId];
    }

    visiting[nodeId] = true;
    const children = childrenById[nodeId] || [];
    const ownW = nodeSizeById[nodeId] ? nodeSizeById[nodeId].w : 140;
    if (children.length === 0) {
        memo[nodeId] = ownW;
        visiting[nodeId] = false;
        return memo[nodeId];
    }

    let total = 0;
    for (let i = 0; i < children.length; i++) {
        total += topologyComputeSubtreeWidth(children[i], childrenById, nodeSizeById, hGap, visiting, memo);
    }
    total += hGap * (children.length - 1);
    memo[nodeId] = Math.max(ownW, total);
    visiting[nodeId] = false;
    return memo[nodeId];
}

function topologyAssignPositions(nodeId, childrenById, nodeSizeById, subtreeWById, levelY, xLeft, hGap, vGap, outPos, visited) {
    if (visited[nodeId]) {
        return;
    }
    visited[nodeId] = true;

    const nodeSize = nodeSizeById[nodeId] || {w: 140, h: 55};
    const subtreeW = subtreeWById[nodeId] != null ? subtreeWById[nodeId] : nodeSize.w;
    const xCenter = xLeft + subtreeW / 2;
    outPos[nodeId] = {x: xCenter - nodeSize.w / 2, y: levelY};

    const children = childrenById[nodeId] || [];
    if (children.length === 0) {
        return;
    }

    const nextY = levelY + nodeSize.h + vGap;
    let childX = xLeft;
    for (let i = 0; i < children.length; i++) {
        const childId = children[i];
        const childSubtreeW = subtreeWById[childId] != null
            ? subtreeWById[childId]
            : (nodeSizeById[childId] ? nodeSizeById[childId].w : 140);

        topologyAssignPositions(childId, childrenById, nodeSizeById, subtreeWById, nextY, childX, hGap, vGap, outPos, visited);
        childX += childSubtreeW + hGap;
    }
}

function topologyShowVeil() {
    const veil = document.getElementById("veil");
    if (veil) {
        veil.style.display = "block";
    }
}

function topologyHideVeil() {
    const veil = document.getElementById("veil");
    if (veil) {
        veil.style.display = "none";
    }
}

function topologyRunWithOptionalVeil(fn, options) {
    options = options || {};
    const delayMs = options.delayMs != null ? options.delayMs : 120;
    let shown = false;

    const t = window.setTimeout(function () {
        topologyShowVeil();
        shown = true;
    }, delayMs);

    window.setTimeout(function () {
        try {
            fn();
        } finally {
            window.clearTimeout(t);
            if (shown) {
                topologyHideVeil();
            }
        }
    }, 0);
}

window.autoLayoutTree = function (options) {
    options = options || {};
    const hGap = options.hGap != null ? options.hGap : 70;
    const vGap = options.vGap != null ? options.vGap : 80;
    const padding = options.padding != null ? options.padding : 10;
    const centerInView = options.centerInView != null ? options.centerInView : false;

    topologyRunWithOptionalVeil(function () {
        jsPlumb.ready(function () {
            try {
                const nodeEls = $("#drawing .window").toArray();
                if (!nodeEls || nodeEls.length === 0) {
                    return;
                }

                // Build node sizes (unscaled), and stable list of ids.
                const nodeSizeById = {};
                const nodeIds = [];
                for (let i = 0; i < nodeEls.length; i++) {
                    const el = nodeEls[i];
                    if (!el || !el.id) {
                        continue;
                    }
                    nodeIds.push(el.id);
                    nodeSizeById[el.id] = {w: el.offsetWidth || 140, h: el.offsetHeight || 55};
                }

                const connections = jsPlumb.getAllConnections ? jsPlumb.getAllConnections() : [];
                const graph = topologyBuildChildren(connections);
                const rootId = topologyPickRoot(nodeIds, graph.childrenById, graph.indegree);
                if (!rootId) {
                    return;
                }

                // Compute subtree widths.
                const subtreeWById = {};
                for (let j = 0; j < nodeIds.length; j++) {
                    topologyComputeSubtreeWidth(
                        nodeIds[j],
                        graph.childrenById,
                        nodeSizeById,
                        hGap,
                        {},
                        subtreeWById);
                }

                // Assign relative positions starting from root.
                const relPos = {};
                topologyAssignPositions(
                    rootId,
                    graph.childrenById,
                    nodeSizeById,
                    subtreeWById,
                    0,
                    0,
                    hGap,
                    vGap,
                    relPos,
                    {});

                // Translate either to the current viewport center or keep root on its current position (default).
                let dx = 0;
                let dy = 0;
                if (centerInView) {
                    let minX = null, minY = null, maxX = null, maxY = null;
                    for (let bb = 0; bb < nodeIds.length; bb++) {
                        const bid = nodeIds[bb];
                        const rp = relPos[bid];
                        if (!rp) {
                            continue;
                        }
                        const sz = nodeSizeById[bid] || {w: 140, h: 55};
                        minX = minX == null ? rp.x : Math.min(minX, rp.x);
                        minY = minY == null ? rp.y : Math.min(minY, rp.y);
                        maxX = maxX == null ? (rp.x + sz.w) : Math.max(maxX, rp.x + sz.w);
                        maxY = maxY == null ? (rp.y + sz.h) : Math.max(maxY, rp.y + sz.h);
                    }

                    if (minX != null && minY != null && maxX != null && maxY != null) {
                        const layoutCx = (minX + maxX) / 2;
                        const layoutCy = (minY + maxY) / 2;

                        const $topology = $("#topology");
                        const $drawing = $("#drawing");
                        const topoW = $topology.width() || 0;
                        const topoH = $topology.height() || 0;
                        const drawingLeft = topologyParsePx($drawing.css("left"), 0);
                        const drawingTop = topologyParsePx($drawing.css("top"), 0);

                        const topoCookie = getTopology();
                        const z = (jsPlumb.getZoom && jsPlumb.getZoom()) || topoCookie.__zoom__ || 1 || 1;

                        const viewCx = (topoW / 2 - drawingLeft) / z;
                        const viewCy = (topoH / 2 - drawingTop) / z;

                        dx = viewCx - layoutCx;
                        dy = viewCy - layoutCy;
                    }
                } else {
                    const rootEl = document.getElementById(rootId);
                    let rootLeft = topologyParsePx(rootEl && rootEl.style ? rootEl.style.left : null, 0);
                    let rootTop = topologyParsePx(rootEl && rootEl.style ? rootEl.style.top : null, 0);
                    if (isNaN(rootLeft) || isNaN(rootTop) || (rootLeft === 0 && rootTop === 0)) {
                        rootLeft = topologyParsePx($(rootEl).css("left"), 0);
                        rootTop = topologyParsePx($(rootEl).css("top"), 0);
                    }
                    const rootRel = relPos[rootId];
                    dx = rootLeft - (rootRel ? rootRel.x : 0);
                    dy = rootTop - (rootRel ? rootRel.y : 0);
                }

                const topo = getTopology();
                let placedMinX = null;
                let placedMaxX = null;
                let placedMaxY = null;

                if (jsPlumb.setSuspendDrawing) {
                    jsPlumb.setSuspendDrawing(true);
                }

                for (let k = 0; k < nodeIds.length; k++) {
                    const id = nodeIds[k];
                    const p = relPos[id];
                    if (!p) {
                        continue;
                    }
                    const x = Math.round(p.x + dx + padding);
                    const y = Math.round(p.y + dy + padding);

                    const nEl = document.getElementById(id);
                    if (!nEl) {
                        continue;
                    }
                    nEl.style.left = x + "px";
                    nEl.style.top = y + "px";

                    placedMinX = placedMinX == null ? x : Math.min(placedMinX, x);
                    placedMaxX = placedMaxX == null ? x : Math.max(placedMaxX, x + (nodeSizeById[id] ? nodeSizeById[id].w : 140));
                    placedMaxY = placedMaxY == null ? y : Math.max(placedMaxY, y + (nodeSizeById[id] ? nodeSizeById[id].h : 55));

                    if (topo[id] == null) {
                        topo[id] = {top: y + "px", left: x + "px"};
                    } else {
                        topo[id].top = y + "px";
                        topo[id].left = x + "px";
                    }
                }

                const unplaced = [];
                for (let u = 0; u < nodeIds.length; u++) {
                    if (!relPos[nodeIds[u]]) {
                        unplaced.push(nodeIds[u]);
                    }
                }
                if (unplaced.length > 0) {
                    let startX = (placedMaxX == null ? 0 : placedMaxX) + hGap * 2;
                    let startY = (placedMinX == null ? 0 : (placedMinX - 20));
                    let colX = startX;
                    let rowY = startY;
                    let colW = 0;
                    const maxColH = Math.max(420, (placedMaxY == null ? 420 : (placedMaxY - startY)));
                    for (let ui = 0; ui < unplaced.length; ui++) {
                        const uid = unplaced[ui];
                        const us = nodeSizeById[uid] || {w: 140, h: 55};
                        if ((rowY - startY) + us.h > maxColH) {
                            colX = colX + colW + hGap;
                            rowY = startY;
                            colW = 0;
                        }

                        const ux = Math.round(colX + padding);
                        const uy = Math.round(rowY + padding);
                        const uEl = document.getElementById(uid);
                        if (uEl) {
                            uEl.style.left = ux + "px";
                            uEl.style.top = uy + "px";
                        }
                        topo[uid] = {top: uy + "px", left: ux + "px"};

                        rowY += us.h + 12;
                        colW = Math.max(colW, us.w);
                    }
                }

                $.cookie("topology", JSON.stringify(topo), {expires: 9999});

                let treeMinX = null, treeMinY = null, treeMaxX = null, treeMaxY = null;
                for (let tb = 0; tb < nodeIds.length; tb++) {
                    const tid = nodeIds[tb];
                    const tp = relPos[tid];
                    if (!tp) {
                        continue;
                    }
                    const ts = nodeSizeById[tid] || {w: 140, h: 55};
                    const ax = tp.x + dx + padding;
                    const ay = tp.y + dy + padding;
                    treeMinX = treeMinX == null ? ax : Math.min(treeMinX, ax);
                    treeMinY = treeMinY == null ? ay : Math.min(treeMinY, ay);
                    treeMaxX = treeMaxX == null ? (ax + ts.w) : Math.max(treeMaxX, ax + ts.w);
                    treeMaxY = treeMaxY == null ? (ay + ts.h) : Math.max(treeMaxY, ay + ts.h);
                }
                window.__topologyTreeBBox = (treeMinX == null) ? null : {
                    minX: treeMinX,
                    minY: treeMinY,
                    maxX: treeMaxX,
                    maxY: treeMaxY
                };

                if (jsPlumb.setSuspendDrawing) {
                    jsPlumb.setSuspendDrawing(false, true);
                } else {
                    jsPlumb.repaintEverything();
                }

                if (window.__topologyTreeBBox) {
                    recenterToTree();
                }
            } catch (err) {
                console.debug("autoLayoutTree failed", err);
            }
        });
    });
};

function topologyGetZoom() {
    const topoCookie = getTopology();
    const z = (jsPlumb.getZoom && jsPlumb.getZoom()) || topoCookie.__zoom__ || 1;
    return z || 1;
}

function topologyRecenterOnBBox(bbox) {
    if (!bbox) {
        return;
    }
    const $topology = $("#topology");
    const $drawing = $("#drawing");
    if ($topology.length === 0 || $drawing.length === 0) {
        return;
    }

    const topoW = $topology.width() || 0;
    const topoH = $topology.height() || 0;
    if (topoW <= 0 || topoH <= 0) {
        return;
    }

    const z = topologyGetZoom();
    const drawingW = $drawing.width() || 0;
    const drawingH = $drawing.height() || 0;
    const originX = drawingW * 0.5;
    const originY = drawingH * 0.5;

    const cx = (bbox.minX + bbox.maxX) / 2;
    const cy = (bbox.minY + bbox.maxY) / 2;

    const viewportCenterX = topoW / 2;
    const viewportCenterY = topoH / 2;

    const newLeft = viewportCenterX - originX - (cx - originX) * z;
    const newTop = viewportCenterY - originY - (cy - originY) * z;

    $drawing.css("left", Math.round(newLeft) + "px");
    $drawing.css("top", Math.round(newTop) + "px");
    jsPlumb.repaintEverything();
}

window.recenterToTree = function () {
    topologyRunWithOptionalVeil(function () {
        jsPlumb.ready(function () {
            let bbox = window.__topologyTreeBBox;
            if (!bbox) {
                const nodeEls = $("#drawing .window").toArray();
                let minX = null, minY = null, maxX = null, maxY = null;
                for (let i = 0; i < nodeEls.length; i++) {
                    const el = nodeEls[i];
                    if (!el) {
                        continue;
                    }
                    const x = topologyParsePx($(el).css("left"), 0);
                    const y = topologyParsePx($(el).css("top"), 0);
                    const w = el.offsetWidth || 140;
                    const h = el.offsetHeight || 55;
                    minX = minX == null ? x : Math.min(minX, x);
                    minY = minY == null ? y : Math.min(minY, y);
                    maxX = maxX == null ? (x + w) : Math.max(maxX, x + w);
                    maxY = maxY == null ? (y + h) : Math.max(maxY, y + h);
                }
                bbox = (minX == null) ? null : {minX: minX, minY: minY, maxX: maxX, maxY: maxY};
            }

            topologyRecenterOnBBox(bbox);
        });
    });
};

jsPlumb.importDefaults({
    Connector: ["Bezier", { curviness: 10 }],
    DragOptions: {
        cursor: "pointer",
        zIndex: 2000
    },
    HoverClass: "connector-hover"
});

jQuery(function () {
    const pendingStatusByTarget = {};
    let flushScheduled = false;

    function applyStatus(targetId, status) {
        if (!targetId) {
            return;
        }
        switch (status) {
            case 'UNKNOWN':
                unknown(targetId);
                break;
            case 'REACHABLE':
                enable(targetId);
                break;
            case 'UNREACHABLE':
                disable(targetId);
                break;
            case 'FAILURE':
                failure(targetId);
                break;
            default:
                break;
        }
    }

    function flushStatuses() {
        flushScheduled = false;
        const entries = Object.entries(pendingStatusByTarget);
        if (entries.length === 0) {
            return;
        }

        for (const [k] of entries) {
            delete pendingStatusByTarget[k];
        }

        jsPlumb.ready(function () {
            if (jsPlumb.setSuspendDrawing) {
                jsPlumb.setSuspendDrawing(true);
            }
            try {
                for (let i = 0; i < entries.length; i++) {
                    const [targetId, status] = entries[i];
                    applyStatus(targetId, status);
                }
            } finally {
                if (jsPlumb.setSuspendDrawing) {
                    jsPlumb.setSuspendDrawing(false, true);
                } else {
                    jsPlumb.repaintEverything();
                }
            }
        });
    }

    function scheduleFlush() {
        if (flushScheduled) {
            return;
        }
        flushScheduled = true;
        window.requestAnimationFrame(flushStatuses);
    }

    Wicket.Event.subscribe("/websocket/message", function (_jqEvent, message) {
        const val = JSON.parse(decodeURIComponent(message));
        pendingStatusByTarget[val.target] = val.status;
        scheduleFlush();
    });
});
