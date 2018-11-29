//==============扩展聚散控件右键 START20130604=========================
SuperMap.Events.prototype.BROWSER_EVENTS.push("contextmenu");
SuperMap.Handler.Feature.prototype.EVENTMAP['contextmenu'] = {
    'in': 'click',
    'out': 'clickout'
};
SuperMap.Handler.Feature.prototype.contextmenu = function(evt) {
    return this.handle(evt) ? !this.stopClick: true;
};
SuperMap.Handler.Feature.prototype.handle = function(evt) {
    if (this.feature && !this.feature.layer) {
        this.feature = null;
    }
    var type = evt.type;
    var handled = false;
    var previouslyIn = !!(this.feature);

    var click = (type == "click" || type == "dblclick" || type == "contextmenu");
    this.feature = this.layer.getFeatureFromEvent(evt);
    if (this.feature && !this.feature.layer) {
        this.feature = null;
    }
    if (this.lastFeature && !this.lastFeature.layer) {
        this.lastFeature = null;
    }
    if (this.feature) {
        var inNew = (this.feature != this.lastFeature);
        if (this.geometryTypeMatches(this.feature)) {
            if (previouslyIn && inNew) {
                if (this.lastFeature) {
                    this.triggerCallback(type, 'out', [this.lastFeature]);
                }
                this.triggerCallback(type, 'in', [this.feature, type, evt.xy]);
            } else if (!previouslyIn || click) {
                this.triggerCallback(type, 'in', [this.feature, type, evt.xy]);
            }
            this.lastFeature = this.feature;
            handled = true;
        } else {

            if (this.lastFeature && (previouslyIn && inNew || click)) {

                this.triggerCallback(type, 'out', [this.lastFeature]);
            }

            this.feature = null;
        }
    } else {
        if (this.lastFeature && (previouslyIn || click)) {
            this.triggerCallback(type, 'out', [this.lastFeature]);
        }
    }
    return handled;
};


SuperMap.Control.SelectCluster.prototype.clickFeature = function(feature, triggerType, screenPixel) {

    var selected = (SuperMap.Util.indexOf(feature.layer.selectedFeatures, feature) > -1);
    selected = false;
    if (selected) {
        if (this.toggleSelect()) {
            this.unselect(feature, "click");
        } else if (!this.multipleSelect()) {
            this.unselectAll({
                except: feature
            });
            if (this.repeat) {
                this.selectEvent(feature);
                this.onSelect.call(this.scope, feature);
            }
        }
    } else {
        if (!this.multipleSelect()) {
            this.unselectAll({
                except: feature
            });
        }
        this.select(feature, triggerType, screenPixel);
    }
};

SuperMap.Control.SelectCluster.prototype.select = function(feature, triggerType, screenPixel) {
    if(triggerType!=null) //加上这句，则需要点击，才能查看popup，没有这句代码，则鼠标一上去就可以查看左键popup20130604
    {
        var cont = this.onBeforeSelect.call(this.scope, feature);
        var layer = feature.layer;
        if (cont !== false) {
            cont = layer.events.triggerEvent("beforefeatureselected", {
                feature: feature
            });
            if (cont !== false) {
                layer.selectedFeatures.push(feature);
                this.highlight(feature);
                if (!this.handlers.feature.lastFeature) {
                    this.handlers.feature.lastFeature = layer.selectedFeatures[0];
                }
                if ( triggerType == "contextmenu") {
                    this.onContextMenuSelect.call(this.scope, feature, screenPixel);
                } else {
                    this.selectEvent(feature, triggerType); //无
                    this.onSelect.call(this.scope, feature);
                }
            }
        }
    }
};
SuperMap.Control.SelectCluster.prototype.unselect = function(feature, triggerType, screenPixel) {
    var cont = this.onBeforeSelect.call(this.scope, feature);
    var layer = feature.layer;
    this.unhighlight(feature);
    layer.selectedFeatures.pop(feature);

    layer.events.triggerEvent("featureunselected", {feature: feature});
    this.onUnselect.call(this.scope, feature);
};
//==============扩展聚散控件右键 END=========================

//屏蔽浏览器右键
window.onload = function(){
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
        document.oncontextmenu=function(){
            window.event.returnValue = false;
        }
    }else if (navigator.userAgent.indexOf('Firefox') >= 0){
        if (window.Event)
            document.captureEvents(Event.MOUSEUP);
        document.oncontextmenu=function(e){
            if (e.which == 2 || e.which == 3)
                return false;
        }
    }
};