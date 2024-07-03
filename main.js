'use strict';

(function ($) {
    "use strict";

    const isMobile = {
        Android: () => navigator.userAgent.includes('Android'),
        BlackBerry: () => navigator.userAgent.includes('BlackBerry'),
        iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
        Opera: () => navigator.userAgent.includes('Opera Mini'),
        Windows: () => navigator.userAgent.includes('IEMobile'),
        any: function () {
            return this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows();
        }
    };

    const isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;

    function debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function updateMatchHeight() {
        $('.row-eq-height > [class*="col-"]').matchHeight();
    }

    const debouncedUpdateMatchHeight = debounce(updateMatchHeight, 250);

    window.addEventListener('resize', debouncedUpdateMatchHeight);

    // Initialize WOW.js
    const wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 100,
        mobile: false,
        live: false
    });

    $(window).on('load', function () {
        wow.init();
    });

    $(window).ready(function () {
        $('.countTo_module').each(function () {
            const self = $(this);
            const offsetTop = self.offset().top;
            const countNumber = $('.countTo__number', self);
            let a = 0;

            $(window).scroll(function () {
                const scroll = $(window).scrollTop();
                const wh = $(window).height();

                if (a === 0 && scroll + wh > offsetTop + wh / 4) {
                    const optData = JSON.parse(self.attr('data-options'));
                    const optDefault = {
                        from: 50,
                        to: 2500,
                        speed: 1000,
                        refreshInterval: 50
                    };
                    const options = $.extend(optDefault, optData);

                    countNumber.countTo(options);
                    a = 1;
                }
            });
        });
    });

    $('.grid__inner').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer'
    });

    $.fn.reCalWidth = function () {
        const $self = $(this);
        $self.on('reCalWidth', function () {
            const _self = $(this);
            _self.css('width', '');
            const width = Math.floor(_self.width());
            _self.css('width', width + 'px');
            const height = Math.floor(_self.parent().children('.wide').width() / 2);
            _self.parent().children('.wide').css('height', height + 'px');
        });
        $(window).on('resize', function () {
            $self.trigger('reCalWidth');
        });
    };

    function initializeWork() {
        $('.grid-css').each(function () {
            const workWrapper = $(this);
            const workContainer = $('.grid__inner', workWrapper);
            const filters = $('.filter', workWrapper);
            const duration = 0.3;

            workContainer.imagesLoaded(function () {
                if (workWrapper.hasClass('grid-css--fixheight')) {
                    workContainer.find('.grid-item__content-wrapper').matchHeight();
                }

                workContainer.isotope({
                    layoutMode: 'masonry',
                    itemSelector: '.grid-item',
                    transitionDuration: `${duration}s`,
                    masonry: {
                        columnWidth: '.grid-sizer'
                    }
                });
            });

            filters.on('click', 'a', function (e) {
                e.preventDefault();
                const $el = $(this);
                const selector = $el.attr('data-filter');
                filters.find('.current').removeClass('current');
                $el.parent().addClass('current');
                workContainer.isotope({ filter: selector });
            });

            filters.find('.select-filter').change(function () {
                const $el = $(this);
                const selector = $el.val();
                workContainer.isotope({ filter: selector });
            });

            $('.grid-item', workWrapper).reCalWidth();
        });
    }

    initializeWork();

    // Function to set an image as the background
    function setBackgroundOnClick() {
        $('.portfolio a').on('click', function (e) {
            e.preventDefault();
            const imageUrl = $(this).attr('href');
            $('body').css('background-image', `url(${imageUrl})`);
        });
    }

    setBackgroundOnClick();

    // Set the first image as the default background
    function setBackgroundOnClick() {
        $('.portfolio a').on('click', function (e) {
            e.preventDefault();
            const imageUrl = $(this).attr('href');
            $('html').css('background-image', `url(${imageUrl})`);
        });
    }

    setDefaultBackground();

    $('.portfolio').magnificPopup({
        delegate: 'a',
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="pe-7s-close"></i></button>',
        removalDelay: 500,
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        midClick: true
    });

    $('.portfolio .popup-video').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        preloader: false,
        closeOnContentClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="pe-7s-close"></i></button>',
        removalDelay: 500,
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        midClick: true
    });

    $('.video .popup-video').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        preloader: false,
        closeOnContentClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="pe-7s-close"></i></button>',
        removalDelay: 500,
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        midClick: true
    });

    const progress = $('.progress');

    progress.each(function () {
        const _self = $(this);
        const progressNumber = _self.find('.progress__number');
        progressNumber.text('0%');

        _self.waypoint(function () {
            const progressBar = _self.find('.progress__bar');
            const delay = progressBar.data("delay");
            const durations = progressBar.data("duration");
            const timing = progressBar.data("timing");
            const getPercent = progressBar.data('progress-percent');

            progressBar.css({
                'width': `${getPercent}%`,
                'transition': `all ${durations}ms ${timing}`,
                'transition-delay': `${delay}ms`
            });

            setTimeout(function () {
                progressNumber.prop('Counter', 0).animate({
                    Counter: getPercent
                }, {
                    duration: durations,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(`${Math.ceil(now)}%`);
                    }
                });
            }, delay);

            this.destroy();
        }, {
            offset: function () {
                return Waypoint.viewportHeight() - _self.outerHeight() - 150;
            }
        });
    });

    const smokyBG = $('#smoky-bg').waterpipe({
        gradientStart: '#51ff00',
        gradientEnd: '#001eff',
        smokeOpacity: 0.1,
        smokeSize: 100,
        numCircles: 1,
        maxMaxRad: 'auto',
        minMaxRad: 'auto',
        minRadFactor: 0,
        iterations: 8,
        drawsPerFrame: 10,
        lineWidth: 2,
        speed: 10,
        bgColorInner: "#111",
        bgColorOuter: "#000"
    });

    $('.swiper__module').each(function () {
        const self = $(this);
        const wrapper = $('.swiper-wrapper', self);
        const optData = JSON.parse(self.attr('data-options'));
        const optDefault = {
            paginationClickable: true,
            pagination: self.find('.swiper-pagination-custom'),
            nextButton: self.find('.swiper-button-next-custom'),
            prevButton: self.find('.swiper-button-prev-custom'),
            spaceBetween: 30
        };
        const options = $.extend(optDefault, optData);

        wrapper.children().wrap('<div class="swiper-slide"></div>');
        const swiper = new Swiper(self[0], options);

        function thumbnails(selector) {
            if (selector.length > 0) {
                const wrapperThumbs = selector.children('.swiper-wrapper');
                const optDataThumbs = JSON.parse(selector.attr('data-options'));
                const optDefaultThumbs = {
                    spaceBetween: 10,
                    centeredSlides: true,
                    slidesPerView: 3,
                    touchRatio: 0.3,
                    slideToClickedSlide: true,
                    pagination: selector.find('.swiper-pagination-custom'),
                    nextButton: selector.find('.swiper-button-next-custom'),
                    prevButton: selector.find('.swiper-button-prev-custom')
                };
                const optionsThumbs = $.extend(optDefaultThumbs, optDataThumbs);

                wrapperThumbs.children().wrap('<div class="swiper-slide"></div>');
                const swiperThumbs = new Swiper(selector[0], optionsThumbs);
                swiper.params.control = swiperThumbs;
                swiperThumbs.params.control = swiper;
            }
        }

        thumbnails(self.next('.swiper-thumbnails__module'));
    });

    $('.tabs__module').each(function () {
        const self = $(this);
        const optData = JSON.parse(self.attr('data-options'));
        const optDefault = {
            active: 0,
            activeEvent: 'click',
            navigatorPosition: 'top'
        };
        const options = $.extend(optDefault, optData);

        self.aweTabs(options);
    });

    $('#back-to-top').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: 0 }, 700);
    });

    $(window).scroll(function () {
        const scrollTop = $(window).scrollTop();
        const wh = $(window).height();
        const half = wh / 2;

        if (scrollTop >= half) {
            $('header').addClass('is-scroll');
        } else {
            $('header').removeClass('is-scroll');
        }

        if (scrollTop >= wh) {
            $('#back-to-top').addClass('is-visible');
        } else {
            $('#back-to-top').removeClass('is-visible');
        }
    });

    $('#back-to-down').on('click', function () {
        const offsets = $(this).closest('.hero').next().offset().top - $('header').outerHeight();
        $('html,body').animate({ scrollTop: offsets }, 700);
    });

    $('.carousel').each(function () {
        const $this = $(this);
        $this.slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev">Previous</button>',
            nextArrow: '<button type="button" class="slick-next">Next</button>',
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    });

})(jQuery);
'use strict';

(function ($) {
    "use strict";

    const isMobile = {
        Android: () => navigator.userAgent.includes('Android'),
        BlackBerry: () => navigator.userAgent.includes('BlackBerry'),
        iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
        Opera: () => navigator.userAgent.includes('Opera Mini'),
        Windows: () => navigator.userAgent.includes('IEMobile'),
        any: function () {
            return this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows();
        }
    };

    const isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;

    function debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function updateMatchHeight() {
        $('.row-eq-height > [class*="col-"]').matchHeight();
    }

    const debouncedUpdateMatchHeight = debounce(updateMatchHeight, 250);

    window.addEventListener('resize', debouncedUpdateMatchHeight);

    // Initialize WOW.js
    const wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 100,
        mobile: false,
        live: false
    });

    $(window).on('load', function () {
        wow.init();
    });

    $(window).ready(function () {
        $('.countTo_module').each(function () {
            const self = $(this);
            const offsetTop = self.offset().top;
            const countNumber = $('.countTo__number', self);
            let a = 0;

            $(window).scroll(function () {
                const scroll = $(window).scrollTop();
                const wh = $(window).height();

                if (a === 0 && scroll + wh > offsetTop + wh / 4) {
                    const optData = JSON.parse(self.attr('data-options'));
                    const optDefault = {
                        from: 50,
                        to: 2500,
                        speed: 1000,
                        refreshInterval: 50
                    };
                    const options = $.extend(optDefault, optData);

                    countNumber.countTo(options);
                    a = 1;
                }
            });
        });
    });

    $('.grid__inner').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer'
    });

    $.fn.reCalWidth = function () {
        const $self = $(this);
        $self.on('reCalWidth', function () {
            const _self = $(this);
            _self.css('width', '');
            const width = Math.floor(_self.width());
            _self.css('width', width + 'px');
            const height = Math.floor(_self.parent().children('.wide').width() / 2);
            _self.parent().children('.wide').css('height', height + 'px');
        });
        $(window).on('resize', function () {
            $self.trigger('reCalWidth');
        });
    };

    function initializeWork() {
        $('.grid-css').each(function () {
            const workWrapper = $(this);
            const workContainer = $('.grid__inner', workWrapper);
            const filters = $('.filter', workWrapper);
            const duration = 0.3;

            workContainer.imagesLoaded(function () {
                if (workWrapper.hasClass('grid-css--fixheight')) {
                    workContainer.find('.grid-item__content-wrapper').matchHeight();
                }

                workContainer.isotope({
                    layoutMode: 'masonry',
                    itemSelector: '.grid-item',
                    transitionDuration: `${duration}s`,
                    masonry: {
                        columnWidth: '.grid-sizer'
                    }
                });
            });

            filters.on('click', 'a', function (e) {
                e.preventDefault();
                const $el = $(this);
                const selector = $el.attr('data-filter');
                filters.find('.current').removeClass('current');
                $el.parent().addClass('current');
                workContainer.isotope({ filter: selector });
            });

            filters.find('.select-filter').change(function () {
                const $el = $(this);
                const selector = $el.val();
                workContainer.isotope({ filter: selector });
            });

            $('.grid-item', workWrapper).reCalWidth();
        });
    }

    initializeWork();

    // Function to set an image as the background
    function setBackgroundOnClick() {
        $('.portfolio a').on('click', function (e) {
            e.preventDefault();
            const imageUrl = $(this).attr('href');
            $('body').css('background-image', `url(${imageUrl})`);
        });
    }

    setBackgroundOnClick();

    // Set the first image as the default background
    function setDefaultBackground() {
        const firstImage = $('.portfolio a').first().attr('href');
        if (firstImage) {
            $('body').css('background-image', `url(${firstImage})`);
        }
    }

    setDefaultBackground();

    $('.portfolio').magnificPopup({
        delegate: 'a',
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="pe-7s-close"></i></button>',
        removalDelay: 500,
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        midClick: true
    });

    $('.portfolio .popup-video').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        preloader: false,
        closeOnContentClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="pe-7s-close"></i></button>',
        removalDelay: 500,
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        midClick: true
    });

    $('.video .popup-video').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        preloader: false,
        closeOnContentClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="pe-7s-close"></i></button>',
        removalDelay: 500,
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        midClick: true
    });

    const progress = $('.progress');

    progress.each(function () {
        const _self = $(this);
        const progressNumber = _self.find('.progress__number');
        progressNumber.text('0%');

        _self.waypoint(function () {
            const progressBar = _self.find('.progress__bar');
            const delay = progressBar.data("delay");
            const durations = progressBar.data("duration");
            const timing = progressBar.data("timing");
            const getPercent = progressBar.data('progress-percent');

            progressBar.css({
                'width': `${getPercent}%`,
                'transition': `all ${durations}ms ${timing}`,
                'transition-delay': `${delay}ms`
            });

            setTimeout(function () {
                progressNumber.prop('Counter', 0).animate({
                    Counter: getPercent
                }, {
                    duration: durations,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(`${Math.ceil(now)}%`);
                    }
                });
            }, delay);

            this.destroy();
        }, {
            offset: function () {
                return Waypoint.viewportHeight() - _self.outerHeight() - 150;
            }
        });
    });

    const smokyBG = $('#smoky-bg').waterpipe({
        gradientStart: '#51ff00',
        gradientEnd: '#001eff',
        smokeOpacity: 0.1,
        smokeSize: 100,
        numCircles: 1,
        maxMaxRad: 'auto',
        minMaxRad: 'auto',
        minRadFactor: 0,
        iterations: 8,
        drawsPerFrame: 10,
        lineWidth: 2,
        speed: 10,
        bgColorInner: "#111",
        bgColorOuter: "#000"
    });

    $('.swiper__module').each(function () {
        const self = $(this);
        const wrapper = $('.swiper-wrapper', self);
        const optData = JSON.parse(self.attr('data-options'));
        const optDefault = {
            paginationClickable: true,
            pagination: self.find('.swiper-pagination-custom'),
            nextButton: self.find('.swiper-button-next-custom'),
            prevButton: self.find('.swiper-button-prev-custom'),
            spaceBetween: 30
        };
        const options = $.extend(optDefault, optData);

        wrapper.children().wrap('<div class="swiper-slide"></div>');
        const swiper = new Swiper(self[0], options);

        function thumbnails(selector) {
            if (selector.length > 0) {
                const wrapperThumbs = selector.children('.swiper-wrapper');
                const optDataThumbs = JSON.parse(selector.attr('data-options'));
                const optDefaultThumbs = {
                    spaceBetween: 10,
                    centeredSlides: true,
                    slidesPerView: 3,
                    touchRatio: 0.3,
                    slideToClickedSlide: true,
                    pagination: selector.find('.swiper-pagination-custom'),
                    nextButton: selector.find('.swiper-button-next-custom'),
                    prevButton: selector.find('.swiper-button-prev-custom')
                };
                const optionsThumbs = $.extend(optDefaultThumbs, optDataThumbs);

                wrapperThumbs.children().wrap('<div class="swiper-slide"></div>');
                const swiperThumbs = new Swiper(selector[0], optionsThumbs);
                swiper.params.control = swiperThumbs;
                swiperThumbs.params.control = swiper;
            }
        }

        thumbnails(self.next('.swiper-thumbnails__module'));
    });

    $('.tabs__module').each(function () {
        const self = $(this);
        const optData = JSON.parse(self.attr('data-options'));
        const optDefault = {
            active: 0,
            activeEvent: 'click',
            navigatorPosition: 'top'
        };
        const options = $.extend(optDefault, optData);

        self.aweTabs(options);
    });

    $('#back-to-top').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: 0 }, 700);
    });

    $(window).scroll(function () {
        const scrollTop = $(window).scrollTop();
        const wh = $(window).height();
        const half = wh / 2;

        if (scrollTop >= half) {
            $('header').addClass('is-scroll');
        } else {
            $('header').removeClass('is-scroll');
        }

        if (scrollTop >= wh) {
            $('#back-to-top').addClass('is-visible');
        } else {
            $('#back-to-top').removeClass('is-visible');
        }
    });

    $('#back-to-down').on('click', function () {
        const offsets = $(this).closest('.hero').next().offset().top - $('header').outerHeight();
        $('html,body').animate({ scrollTop: offsets }, 700);
    });

    $('.carousel').each(function () {
        const $this = $(this);
        $this.slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev">Previous</button>',
            nextArrow: '<button type="button" class="slick-next">Next</button>',
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    });

})(jQuery);
'use strict';

(function ($) {
    "use strict";

    const isMobile = {
        Android: () => navigator.userAgent.includes('Android'),
        BlackBerry: () => navigator.userAgent.includes('BlackBerry'),
        iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
        Opera: () => navigator.userAgent.includes('Opera Mini'),
        Windows: () => navigator.userAgent.includes('IEMobile'),
        any: function () {
            return this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows();
        }
    };

    const isIE = /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;

    function debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function updateMatchHeight() {
        $('.row-eq-height > [class*="col-"]').matchHeight();
    }

    const debouncedUpdateMatchHeight = debounce(updateMatchHeight, 250);

    window.addEventListener('resize', debouncedUpdateMatchHeight);

    // Initialize WOW.js
    const wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 100,
        mobile: false,
        live: false
    });

    $(window).on('load', function () {
        wow.init();
    });

    $(window).ready(function () {
        $('.countTo_module').each(function () {
            const self = $(this);
            const offsetTop = self.offset().top;
            const countNumber = $('.countTo__number', self);
            let a = 0;

            $(window).scroll(function () {
                const scroll = $(window).scrollTop();
                const wh = $(window).height();

                if (a === 0 && scroll + wh > offsetTop + wh / 4) {
                    const optData = JSON.parse(self.attr('data-options'));
                    const optDefault = {
                        from: 50,
                        to: 2500,
                        speed: 1000,
                        refreshInterval: 50
                    };
                    const options = $.extend(optDefault, optData);

                    countNumber.countTo(options);
                    a = 1;
                }
            });
        });
    });

    $('.grid__inner').masonry({
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer'
    });

    $.fn.reCalWidth = function () {
        const $self = $(this);
        $self.on('reCalWidth', function () {
            const _self = $(this);
            _self.css('width', '');
            const width = Math.floor(_self.width());
            _self.css('width', width + 'px');
            const height = Math.floor(_self.parent().children('.wide').width() / 2);
            _self.parent().children('.wide').css('height', height + 'px');
        });
        $(window).on('resize', function () {
            $self.trigger('reCalWidth');
        });
    };

    function initializeWork() {
        $('.grid-css').each(function () {
            const workWrapper = $(this);
            const workContainer = $('.grid__inner', workWrapper);
            const filters = $('.filter', workWrapper);
            const duration = 0.3;

            workContainer.imagesLoaded(function () {
                if (workWrapper.hasClass('grid-css--fixheight')) {
                    workContainer.find('.grid-item__content-wrapper').matchHeight();
                }

                workContainer.isotope({
                    layoutMode: 'masonry',
                    itemSelector: '.grid-item',
                    transitionDuration: `${duration}s`,
                    masonry: {
                        columnWidth: '.grid-sizer'
                    }
                });
            });

            filters.on('click', 'a', function (e) {
                e.preventDefault();
                const $el = $(this);
                const selector = $el.attr('data-filter');
                filters.find('.current').removeClass('current');
                $el.parent().addClass('current');
                workContainer.isotope({ filter: selector });
            });

            filters.find('.select-filter').change(function () {
                const $el = $(this);
                const selector = $el.val();
                workContainer.isotope({ filter: selector });
            });

            $('.grid-item', workWrapper).reCalWidth();
        });
    }

    initializeWork();

    // Function to set an image as the background
    function setBackgroundOnClick() {
        $('.portfolio a').on('click', function (e) {
            e.preventDefault();
            const imageUrl = $(this).attr('href');
            $('body').css('background-image', `url(${imageUrl})`);
        });
    }

    setBackgroundOnClick();

    // Set the first image as the default background
    function setDefaultBackground() {
        const firstImage = $('.portfolio a').first().attr('href');
        if (firstImage) {
            $('body').css('background-image', `url(${firstImage})`);
        }
    }

    setDefaultBackground();

    $('.portfolio').magnificPopup({
        delegate: 'a',
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="pe-7s-close"></i></button>',
        removalDelay: 500,
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        midClick: true
    });

    $('.portfolio .popup-video').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        preloader: false,
        closeOnContentClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="pe-7s-close"></i></button>',
        removalDelay: 500,
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        midClick: true
    });

    $('.video .popup-video').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        preloader: false,
        closeOnContentClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
        closeMarkup: '<button title="%title%" type="button" class="mfp-close"><i class="pe-7s-close"></i></button>',
        removalDelay: 500,
        callbacks: {
            beforeOpen: function () {
                this.st.mainClass = this.st.el.attr('data-effect');
            }
        },
        midClick: true
    });

    const progress = $('.progress');

    progress.each(function () {
        const _self = $(this);
        const progressNumber = _self.find('.progress__number');
        progressNumber.text('0%');

        _self.waypoint(function () {
            const progressBar = _self.find('.progress__bar');
            const delay = progressBar.data("delay");
            const durations = progressBar.data("duration");
            const timing = progressBar.data("timing");
            const getPercent = progressBar.data('progress-percent');

            progressBar.css({
                'width': `${getPercent}%`,
                'transition': `all ${durations}ms ${timing}`,
                'transition-delay': `${delay}ms`
            });

            setTimeout(function () {
                progressNumber.prop('Counter', 0).animate({
                    Counter: getPercent
                }, {
                    duration: durations,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(`${Math.ceil(now)}%`);
                    }
                });
            }, delay);

            this.destroy();
        }, {
            offset: function () {
                return Waypoint.viewportHeight() - _self.outerHeight() - 150;
            }
        });
    });

    const smokyBG = $('#smoky-bg').waterpipe({
        gradientStart: '#51ff00',
        gradientEnd: '#001eff',
        smokeOpacity: 0.1,
        smokeSize: 100,
        numCircles: 1,
        maxMaxRad: 'auto',
        minMaxRad: 'auto',
        minRadFactor: 0,
        iterations: 8,
        drawsPerFrame: 10,
        lineWidth: 2,
        speed: 10,
        bgColorInner: "#111",
        bgColorOuter: "#000"
    });

    $('.swiper__module').each(function () {
        const self = $(this);
        const wrapper = $('.swiper-wrapper', self);
        const optData = JSON.parse(self.attr('data-options'));
        const optDefault = {
            paginationClickable: true,
            pagination: self.find('.swiper-pagination-custom'),
            nextButton: self.find('.swiper-button-next-custom'),
            prevButton: self.find('.swiper-button-prev-custom'),
            spaceBetween: 30
        };
        const options = $.extend(optDefault, optData);

        wrapper.children().wrap('<div class="swiper-slide"></div>');
        const swiper = new Swiper(self[0], options);

        function thumbnails(selector) {
            if (selector.length > 0) {
                const wrapperThumbs = selector.children('.swiper-wrapper');
                const optDataThumbs = JSON.parse(selector.attr('data-options'));
                const optDefaultThumbs = {
                    spaceBetween: 10,
                    centeredSlides: true,
                    slidesPerView: 3,
                    touchRatio: 0.3,
                    slideToClickedSlide: true,
                    pagination: selector.find('.swiper-pagination-custom'),
                    nextButton: selector.find('.swiper-button-next-custom'),
                    prevButton: selector.find('.swiper-button-prev-custom')
                };
                const optionsThumbs = $.extend(optDefaultThumbs, optDataThumbs);

                wrapperThumbs.children().wrap('<div class="swiper-slide"></div>');
                const swiperThumbs = new Swiper(selector[0], optionsThumbs);
                swiper.params.control = swiperThumbs;
                swiperThumbs.params.control = swiper;
            }
        }

        thumbnails(self.next('.swiper-thumbnails__module'));
    });

    $('.tabs__module').each(function () {
        const self = $(this);
        const optData = JSON.parse(self.attr('data-options'));
        const optDefault = {
            active: 0,
            activeEvent: 'click',
            navigatorPosition: 'top'
        };
        const options = $.extend(optDefault, optData);

        self.aweTabs(options);
    });

    $('#back-to-top').on('click', function (e) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: 0 }, 700);
    });

    $(window).scroll(function () {
        const scrollTop = $(window).scrollTop();
        const wh = $(window).height();
        const half = wh / 2;

        if (scrollTop >= half) {
            $('header').addClass('is-scroll');
        } else {
            $('header').removeClass('is-scroll');
        }

        if (scrollTop >= wh) {
            $('#back-to-top').addClass('is-visible');
        } else {
            $('#back-to-top').removeClass('is-visible');
        }
    });

    $('#back-to-down').on('click', function () {
        const offsets = $(this).closest('.hero').next().offset().top - $('header').outerHeight();
        $('html,body').animate({ scrollTop: offsets }, 700);
    });

    $('.carousel').each(function () {
        const $this = $(this);
        $this.slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev">Previous</button>',
            nextArrow: '<button type="button" class="slick-next">Next</button>',
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    });

})(jQuery);
