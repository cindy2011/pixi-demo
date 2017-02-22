(function($) {
    var support_webgl = !!window.WebGLRenderingContext;
    var $window = $(window),
        $body = $('body');
    var is_mobile = $('.is-mobile').length;
    if (typeof xd !== 'undefined' && !is_mobile) {
        xd.getUser(topnav_user_check);
    }




    var browser = {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            };
        }()
    }






    if (support_webgl && !is_mobile) {
        var image_path = location.origin + '/images/';
        var sw = 1920,
            sh = 1080; //标准高宽
        var ww = $window.width(),
            wh = $window.height();
        var stage_data = { //手机版本位置信息
            'view': $('#main-canvas').get(0),
            'folder': image_path,
            'bg': {
                x: 0
            },
            'element': {
                'firegirl_skeleton_sp': {
                    x: 0.5,
                    y: 0.5,
                    loop: false
                },
                'firegirl_skeleton1': {
                    x: 0.5,
                    y: 0.5,
                    loop: false
                },
                'firegirl_skeleton2': {
                    x: 0.5,
                    y: 0.5,
                    loop: false
                },
                'firegirl_skeleton3': {
                    x: 0.5,
                    y: 0.5,
                    loop: false
                }
            }
        };
        var assetsToLoader = [];
        stage_data.stage = new PIXI.Container(0xFFFFFF);
        stage_data.renderer = PIXI.autoDetectRenderer(sw, sh, { view: stage_data.view });
        stage_data.renderer.view.style.width = sw + 'px';
        stage_data.renderer.view.style.height = sh + 'px';
        assetsToLoader.push({ 'name': 'main_canvas_bg', url: image_path + 'bg.jpg?1' });
        for (var j in stage_data.element) {
            assetsToLoader.push({ 'name': j, url: image_path + j + '.json?!' });
        }

        function onAssetLoaded(loader, res) {
            var mid = new PIXI.Sprite.fromImage(image_path + "/bg.jpg?1");
            mid.scale.set(1);
            mid.position.x = stage_data.bg.x * sw;
            stage_data.stage.addChild(mid); //添加背景图片
            for (var j in stage_data.element) {
                var url = image_path + j + '.json?!';
                var sprite = new PIXI.spine.Spine(res[j].spineData);
                var ele = stage_data.element[j];
                if (typeof ele.delay == 'undefined') {
                    sprite.state.setAnimationByName(0, 'animation', true);
                    stage_data.stage.addChild(sprite);
                }
                stage_data.element[j].sprite = sprite;
                sprite.position.x = stage_data.element[j].x * sw;
                sprite.position.y = stage_data.element[j].y * sh;
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            stage_data.renderer.render(stage_data.stage);
        }

        PIXI.loader.add(assetsToLoader)
            .on('complete', function() {
                setTimeout(function() {
                    $body.addClass('support-webgl');
                }, 10);

            }).load(onAssetLoaded);
        requestAnimationFrame(animate);
    }
})(window.jQuery);
