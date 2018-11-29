//自定义右键事件
SuperMap.Events.prototype.BROWSER_EVENTS.push("contextmenu");
SuperMap.Handler.Feature.prototype.EVENTMAP['contextmenu'] = {'in': 'click', 'out': 'clickout'};
SuperMap.Handler.Feature.prototype.contextmenu = function(evt) {
    return this.handle(evt) ? !this.stopClick : true;
};
SuperMap.Handler.Feature.prototype.handle = function(evt) {
    if(this.feature && !this.feature.layer) {
        this.feature = null;
    }
    var type = evt.type;
    var handled = false;
    var previouslyIn = !!(this.feature);
    var click = (type == "click" || type == "dblclick" || type == "contextmenu");
    this.feature = this.layer.getFeatureFromEvent(evt);
    if(this.feature && !this.feature.layer) {
        this.feature = null;
    }
    if(this.lastFeature && !this.lastFeature.layer) {
        this.lastFeature = null;
    }
    if(this.feature) {
        var inNew = (this.feature != this.lastFeature);
        if(this.geometryTypeMatches(this.feature)) {
            if(previouslyIn && inNew) {
                if(this.lastFeature) {
                    this.triggerCallback(type, 'out', [this.lastFeature]);
                }
                this.triggerCallback(type, 'in', [this.feature,type,evt.xy]);
            } else if(!previouslyIn || click) {
                this.triggerCallback(type, 'in', [this.feature,type,evt.xy]);
            }
            this.lastFeature = this.feature;
            handled = true;
        } else {

            if(this.lastFeature && (previouslyIn && inNew || click)) {

                this.triggerCallback(type, 'out', [this.lastFeature]);
            }

            this.feature = null;
        }
    } else {
        if(this.lastFeature && (previouslyIn || click)) {
            this.triggerCallback(type, 'out', [this.lastFeature]);
        }
    }
    return handled;
};

SuperMap.Control.SelectFeature.prototype.clickFeature = function(feature,triggerType,screenPixel) {
    if(!this.hover) {
        var selected = (SuperMap.Util.indexOf(
            feature.layer.selectedFeatures, feature) > -1);
        if(selected) {
            if(this.toggleSelect()) {
                this.unselect(feature);
            } else if(!this.multipleSelect()) {
                this.unselectAll({except: feature});
            }
            this.unselect(feature);
            this.select(feature,triggerType,screenPixel);

        } else {
            if(!this.multipleSelect()) {
                this.unselectAll({except: feature});
            }
            this.select(feature,triggerType,screenPixel);
        }
    }
};

SuperMap.Control.SelectFeature.prototype.select = function(feature,triggerType,screenPixel) {

    var cont = this.onBeforeSelect.call(this.scope, feature);
    var layer = feature.layer;
    if(cont !== false) {
        cont = layer.events.triggerEvent("beforefeatureselected", {
            feature: feature
        });
        if(cont !== false) {
            layer.selectedFeatures.push(feature);
            this.highlight(feature);

            if(!this.handlers.feature.lastFeature) {
                this.handlers.feature.lastFeature = layer.selectedFeatures[0];
            }
            layer.events.triggerEvent("featureselected", {
                feature: feature,
                //添加右键事件标识
                triggerType: triggerType,
                screenPixel: screenPixel
            });

            if(triggerType == "contextmenu"){
                this.onContextMenuSelect.call(this.scope, feature, screenPixel);
            } else {
                this.onSelect.call(this.scope, feature);
            }

        }
    }
};

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
