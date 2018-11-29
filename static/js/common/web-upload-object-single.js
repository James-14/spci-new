/**
 * web-upload 工具类
 *
 * 约定：
 * 上传按钮的id = 图片隐藏域id + 'BtnId'
 * 图片预览框的id = 图片隐藏域id + 'PreId'
 * focusImgBtn:上传事件是否聚焦在图片预览框
 * @author Spci Team
 */
(function() {

	var $WebUpload = function(pictureId,focusImgBtn) {
		this.pictureId = pictureId;
		this.uploadBtnId = pictureId + "BtnId";
		this.uploadPreId = pictureId + "PreId";
		this.uploadUrl = Feng.ctxPath + '/mgr/upload';
		this.fileSizeLimit = 100 * 1024 * 1024;
		this.picWidth = 800;
		this.picHeight = 800;
		this.uploadBarId = null;
		this.focusImgBtn = focusImgBtn;
	};

	$WebUpload.prototype = {
		/**
		 * 初始化webUploader
		 */
		init : function() {
			var uploader = this.create();
			this.bindEvent(uploader);
			return uploader;
		},

		/**
		 * 创建webuploader对象
		 */
		create : function() {

			var uploadIdPath=this.focusImgBtn?this.uploadPreId:this.uploadBtnId;
			var webUploader = WebUploader.create({
				auto : true,
				pick : {
					id : '#' + uploadIdPath,
					multiple : false,// 只上传一个
				},
				accept : {
					title : 'Images',
					extensions : 'gif,jpg,jpeg,bmp,png',
					mimeTypes : 'image/gif,image/jpg,image/jpeg,image/bmp,image/png'
				},
				swf : Feng.ctxPath
				+ '/static/css/plugins/webuploader/Uploader.swf',
				disableGlobalDnd : true,
				duplicate : true,
				server : this.uploadUrl,
				fileSingleSizeLimit : this.fileSizeLimit
			});

			return webUploader;
		},

		/**
		 * 绑定事件
		 */
		bindEvent : function(bindedObj) {
			var me =  this;
			bindedObj.on('fileQueued', function(file) {
				// var $li = $('<div><img width="100px" height="100px"></div>');
				// var $img = $li.find('img');

				// $("#" + me.uploadPreId).html($li);
				var $img=$("#" + me.uploadPreId).find('img');

				// 生成缩略图
				bindedObj.makeThumb(file, function(error, src) {
					if (error) {
						$img.replaceWith('<span>不能预览</span>');
						return;
					}
					$img.attr('src', src);
				}, me.picWidth, me.picHeight);
			});

			// 文件上传过程中创建进度条实时显示。
			bindedObj.on('uploadProgress', function(file, percentage) {
				$("#"+me.uploadBarId).css("width",percentage * 100 + "%");
			});

			// 文件上传成功，给item添加成功class, 用样式标记上传成功。
			bindedObj.on('uploadSuccess', function(file,response) {
				Feng.success("上传成功");
				$("#" + me.pictureId).val(response);
			});

			// 文件上传失败，显示上传出错。
			bindedObj.on('uploadError', function(file) {
				Feng.error("上传失败");
			});

			// 其他错误
			bindedObj.on('error', function(type) {
				if ("Q_EXCEED_SIZE_LIMIT" == type) {
					Feng.error("文件大小超出了限制");
				} else if ("Q_TYPE_DENIED" == type) {
					Feng.error("文件类型不满足");
				} else if ("Q_EXCEED_NUM_LIMIT" == type) {
					Feng.error("上传数量超过限制");
				} else if ("F_DUPLICATE" == type) {
					Feng.error("图片选择重复");
				} else {
					Feng.error("上传过程中出错");
				}
			});

			// 完成上传完了，成功或者失败
			bindedObj.on('uploadComplete', function(file) {
			});
		},

		/**
		 * 设置图片上传的进度条的id
		 */
		setUploadBarId: function (id) {
			this.uploadBarId = id;
		}
	};

	window.$WebUpload = $WebUpload;

}());

function fileUpload(picker,thelist,ctlBtn,data,callback){
	var url = Feng.ctxPath + '/upload';
	if(data && data.url){
		url = Feng.ctxPath + data.url;
	}
	var uploader = WebUploader.create({
		// swf文件路径
		swf: Feng.ctxPath + '/static/css/plugins/webuploader/Uploader.swf',
		// 文件接收服务端。
		server: url,
		formData: data,
		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.
		pick: '#'+picker,
		// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
		resize: false
	});
	// 当有文件被添加进队列的时候
	uploader.on( 'fileQueued', function( file ) {
		$('#'+thelist).append( '<div id="' + file.id + '" class="item">' +
			'<h4 class="info">' + file.name + '</h4>' +
			'<p class="state">等待上传...</p>' +
			'</div>' );
	});
	// 文件上传过程中创建进度条实时显示。
	uploader.on( 'uploadProgress', function( file, percentage ) {
		var $li = $( '#'+file.id ),
			$percent = $li.find('.progress .progress-bar');
		// 避免重复创建
		if ( !$percent.length ) {
			$percent = $('<div class="progress progress-striped active">' +
				'<div class="progress-bar" role="progressbar" style="width: 0%">' +
				'</div>' +
				'</div>').appendTo( $li ).find('.progress-bar');
		}
		$li.find('p.state').text('上传中');
		$percent.css( 'width', percentage * 100 + '%' );
	});
	uploader.on( 'uploadSuccess', function( file,req ) {
		if(callback){//处理返回值（文件名
			callback(req);
		}
		$( '#'+file.id ).find('p.state').text('已上传');
	});
	uploader.on( 'uploadError', function( file ) {
		$( '#'+file.id ).find('p.state').text('上传出错');
	});
	uploader.on( 'uploadComplete', function( file ) {
		$( '#'+file.id ).find('.progress').fadeOut();
	});
	$('#'+ctlBtn).on( 'click', function() {
		uploader.upload();
	});
}