function CMain(oData, oApiInstance){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oPSelection;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
    	/*if (typeof(Storage) !== "undefined") {
		    // Code for localStorage/sessionStorage.
		    var isSound = localStorage.getItem("3drealboxing_sound");
		    if(isSound == null) s_bAudioActive = true;
		    else
		    	s_bAudioActive = isSound;
		}*/
        s_oCanvas = document.getElementById("canvas");
     
        if (location.search.match(/c/i)) {
            // force it to use Context2D if c2d appears in the query string: ex. index.html?c2d        
            s_oStage = new createjs.Stage("canvas");
            s_oStageBg = new createjs.Stage("canvasbg"); 
            s_oStageInterface = new createjs.Stage("canvas_interface"); 
                
        } else {
            // s_oStage = new createjs.Stage("canvas");             	
            s_oStage = new createjs.SpriteStage("canvas",false,false);	
            s_oStageBg = new createjs.SpriteStage("canvasbg",false,false);	  
            s_oStageInterface = new createjs.SpriteStage("canvas_interface",false,false);	  
                
        }
        createjs.Touch.enable(s_oStage);
		
	s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(FPS);
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
        new CBitmapFont();
    };
	
	
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
        _bUpdate = true;
    };
    
    this.soundLoaded = function(evt){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
         if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();
            
            this.gotoMenu();
            
            
         }
    };
    
    this._initSounds = function(){
         if (!createjs.Sound.initializeDefaultPlugins()) {
             return;
         }

        if(navigator.userAgent.indexOf("Opera")>0 || navigator.userAgent.indexOf("OPR")>0){
                createjs.Sound.alternateExtensions = ["mp3"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));
                
                createjs.Sound.registerSound("./sounds/start_match.ogg", "start_match");
                createjs.Sound.registerSound("./sounds/crowd_desperation.ogg", "crowd_desperation");
                createjs.Sound.registerSound("./sounds/crowd_exultance.ogg", "crowd_exultance");
                createjs.Sound.registerSound("./sounds/crowd_idle.ogg", "crowd_idle");
                createjs.Sound.registerSound("./sounds/ko.ogg", "ko");
                createjs.Sound.registerSound("./sounds/soundtrack.ogg", "soundtrack");
                createjs.Sound.registerSound("./sounds/falling.ogg", "falling");

                
                createjs.Sound.registerSound("./sounds/punch_left.ogg", "punch_left");
                createjs.Sound.registerSound("./sounds/punch_right.ogg", "punch_right");         
                createjs.Sound.registerSound("./sounds/uppercut.ogg", "uppercut");
                
                /////////////count////////////
                createjs.Sound.registerSound("./sounds/1.ogg", "1");
                createjs.Sound.registerSound("./sounds/two.ogg", "2");
                createjs.Sound.registerSound("./sounds/three.ogg", "3");
                createjs.Sound.registerSound("./sounds/four.ogg", "4");
                createjs.Sound.registerSound("./sounds/five.ogg", "5");
                createjs.Sound.registerSound("./sounds/six.ogg", "6");
                createjs.Sound.registerSound("./sounds/seven.ogg", "7");
                createjs.Sound.registerSound("./sounds/eight.ogg", "8");
                createjs.Sound.registerSound("./sounds/nine.ogg", "9");   
                /////////////////////////////
        }else{
                createjs.Sound.alternateExtensions = ["ogg"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/start_match.mp3", "start_match");
                createjs.Sound.registerSound("./sounds/crowd_desperation.mp3", "crowd_desperation");
                createjs.Sound.registerSound("./sounds/crowd_exultance.mp3", "crowd_exultance");
                createjs.Sound.registerSound("./sounds/crowd_idle.mp3", "crowd_idle");
                createjs.Sound.registerSound("./sounds/ko.mp3", "ko");
                createjs.Sound.registerSound("./sounds/soundtrack.mp3", "soundtrack");
                createjs.Sound.registerSound("./sounds/falling.mp3", "falling");

                
                createjs.Sound.registerSound("./sounds/punch_left.mp3", "punch_left");
                createjs.Sound.registerSound("./sounds/punch_right.mp3", "punch_right");         
                createjs.Sound.registerSound("./sounds/uppercut.mp3", "uppercut");
                
                
                /////////////count////////////
                createjs.Sound.registerSound("./sounds/one.mp3", "1");
                createjs.Sound.registerSound("./sounds/two.mp3", "2");
                createjs.Sound.registerSound("./sounds/three.mp3", "3");
                createjs.Sound.registerSound("./sounds/four.mp3", "4");
                createjs.Sound.registerSound("./sounds/five.mp3", "5");
                createjs.Sound.registerSound("./sounds/six.mp3", "6");
                createjs.Sound.registerSound("./sounds/seven.mp3", "7");
                createjs.Sound.registerSound("./sounds/eight.mp3", "8");
                createjs.Sound.registerSound("./sounds/nine.mp3", "9");   
                /////////////////////////////
        }
        RESOURCE_TO_LOAD += 19;
        
    };

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("button","./sprites/button.png");
        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("btn_more","./sprites/btn_more.png");
        s_oSpriteLibrary.addSprite("but_defence","./sprites/but_defence.png");
        s_oSpriteLibrary.addSprite("energy_bar","./sprites/energy_bar.png");
        s_oSpriteLibrary.addSprite("fill_energy","./sprites/fill_energy.png");
        s_oSpriteLibrary.addSprite("mask_energy","./sprites/mask_energy.png");
        s_oSpriteLibrary.addSprite("fill_stamina","./sprites/fill_stamina.png");
        s_oSpriteLibrary.addSprite("energy_avatar_white","./sprites/energy_avatar_white.png");
        s_oSpriteLibrary.addSprite("energy_avatar_black","./sprites/energy_avatar_black.png");
        s_oSpriteLibrary.addSprite("icon_energy","./sprites/icon_energy.png");
        s_oSpriteLibrary.addSprite("icon_stamina","./sprites/icon_stamina.png");
        s_oSpriteLibrary.addSprite("countdown_panel_white","./sprites/countdown_panel_white.png");
        s_oSpriteLibrary.addSprite("countdown_panel_black","./sprites/countdown_panel_black.png");
        s_oSpriteLibrary.addSprite("countdown_panel_continue_white","./sprites/countdown_panel_continue_white.png");
        s_oSpriteLibrary.addSprite("countdown_panel_continue_black","./sprites/countdown_panel_continue_black.png");
        s_oSpriteLibrary.addSprite("logo","./sprites/logo.png");
        s_oSpriteLibrary.addSprite("logo_text","./sprites/choose_player_text.png");
        s_oSpriteLibrary.addSprite("bw_selection","./sprites/bw_selection.png");
        s_oSpriteLibrary.addSprite("bb_selection","./sprites/bb_selection.png");
        s_oSpriteLibrary.addSprite("bw_versus","./sprites/bw_versus.png");
        s_oSpriteLibrary.addSprite("bb_versus","./sprites/bb_versus.png");
        s_oSpriteLibrary.addSprite("ko_white","./sprites/ko_player.png");
        s_oSpriteLibrary.addSprite("ko_black","./sprites/ko_enemy.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("bg_pselection","./sprites/bg_mod_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("fade","./sprites/fade.png");
        
       
        
        s_oSpriteLibrary.addSprite("vs","./sprites/vs.png");
        s_oSpriteLibrary.addSprite("but_exit_big","./sprites/but_exit_big.png");
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("audio_icon2","./sprites/audio_icon2.png");
        
        s_oSpriteLibrary.addSprite("bg_help_1","./sprites/bg_help_1.png");
        s_oSpriteLibrary.addSprite("bg_help_2","./sprites/bg_help_2.png");
        s_oSpriteLibrary.addSprite("but_fight","./sprites/but_fight.png");
        s_oSpriteLibrary.addSprite("but_skip","./sprites/but_skip.png");
        
        s_oSpriteLibrary.addSprite("btn_hit_1","./sprites/btn_hit_1.png");
        s_oSpriteLibrary.addSprite("btn_hit_2","./sprites/btn_hit_2.png");
        s_oSpriteLibrary.addSprite("btn_hit_3","./sprites/btn_hit_3.png");
        s_oSpriteLibrary.addSprite("btn_hit_4","./sprites/btn_hit_4.png");
        
        
        for(var i=0;i<5;i++){
            s_oSpriteLibrary.addSprite("particle_"+i,"./sprites/particle/particle_"+i+".png"); 
        }


        
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
        
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            _oPreloader.unload();            
            
            this.gotoMenu();
        }
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){
        
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    this.gotoPSelection = function(){
        _oPSelection = new CSelectCharacter();
        
    };

    this.gotoGame = function(){
        _oGame = new CGame(_oData);   						
        _iState = STATE_GAME;
        
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
            _bUpdate = false;
    };

    this.startUpdate = function(){
            _bUpdate = true;
    };
    
    this.playAllSounds = function(bVal){

            createjs.Sound.setMute(!bVal);
        
    };
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);
		
    };
    
    s_oMain = this;
    
    _oData = oData;
    
    this.initContainer();
}
var s_bMobile;
var s_bLoadedPlayerWhite=false;
var s_bLoadedPlayerBlack=false;
//var s_bAudioActive = true;
var s_iPlayerSelected= 0;//0=WHITE 1=BLACK
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oStageBg;
var s_oStageInterface;
var s_oMain = null;
var s_oSpriteLibrary;
var s_oCanvas;

var s_oSoundtrack = null;
    