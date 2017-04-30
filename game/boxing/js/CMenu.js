function CMenu(){
    var _oBg;
    var _oButPlay;
    var _oButMore;
    var _oFade;
    var _oAudioToggle;
    var _pStartPosPlay;
    var _pStartPosMore;
    var _pStartPosAudio;

    
    this._init = function(){
         

        _pStartPosPlay = {x: (CANVAS_WIDTH - 160), y: CANVAS_HEIGHT -120};
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
        

        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton((_pStartPosPlay.x),_pStartPosPlay.y,oSprite,s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        
        _pStartPosMore = {x: 170, y: _pStartPosPlay.y};
        var oSprite = s_oSpriteLibrary.getSprite('btn_more');
        _oButMore = new CGfxButton((_pStartPosPlay.x),_pStartPosPlay.y,oSprite,s_oStage);
        _oButMore.addEventListener(ON_MOUSE_DOWN, this._onButMorePress, this);
        
        /*if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
           var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
           _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};            
           _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
           _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
           if (s_bAudioActive == false) createjs.Sound.setMute(false);
       }*/

        _oFade = createBitmap(s_oSpriteLibrary.getSprite('fade'));
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 500).call(function(){_oFade.visible = false;});  
       
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);       

                
        s_oSoundtrack = playSound("soundtrack",1,-1);
        setVolume(s_oSoundtrack,1);

    };
    
    this.unload = function(){
        s_oStage.removeAllChildren();
      
        /*if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }*/
        
        s_oMenu = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButPlay.setPosition(_pStartPosPlay.x,_pStartPosPlay.y- iNewY);
        _oButMore.setPosition(_pStartPosMore.x,_pStartPosMore.y- iNewY);
        /*if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x-iNewX,_pStartPosAudio.y+ iNewY);
        }*/
    };
    
    /*this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
        if (typeof(Storage) !== "undefined") {
		    localStorage.setItem("3drealboxing_sound", s_bAudioActive);
		}
    };*/
    
    this._onButPlayRelease = function(){   
        this.unload();
        s_oMain.gotoPSelection();   
        
        $(s_oMain).trigger("start_session");
        
    };
    
    this._onButMorePress = function(){   
    	openMore();
    };
  
    s_oMenu = this;
    
    this._init();
}

function openMore(){
	var service = new tizen.ApplicationControl(
	"http://tizen.org/appcontrol/operation/view",
	"tizenstore://SellerApps/msp8fg47mz",
	null,
	null,
	null);
	var id = "org.tizen.tizenstore";
	try {
		tizen.application.launchAppControl(
		service,
		id,
		function(){console.log("Service launched");},
		function(err){},
		null);
	} catch (exc) {}
}

var s_oMenu = null;