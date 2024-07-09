(function ($) {
    $.fn.mauGallery = function (options) {
        var options = $.extend($.fn.mauGallery.defaults, options);
        var tagsCollection = [];
        return this.each(function () {
            $.fn.mauGallery.methods.createRowWrapper($(this));
            if (options.lightBox) {
                $.fn.mauGallery.methods.createLightBox($(this), options.lightboxId, options.navigation);
            }
            $.fn.mauGallery.listeners(options);

            $(this)
                .children(".gallery-item")
                .each(function (index) {
                    $.fn.mauGallery.methods.responsiveImageItem($(this));
                    $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
                    $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
                    var theTag = $(this).data("gallery-tag");
                    if (options.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
                        tagsCollection.push(theTag);
                    }
                });

            if (options.showTags) {
                $.fn.mauGallery.methods.showItemTags($(this), options.tagsPosition, tagsCollection);
            }

            // $(this).fadeIn(500);
        });
    };
    $.fn.mauGallery.defaults = {
        columns: 3,
        lightBox: true,
        lightboxId: null,
        showTags: true,
        tagsPosition: "bottom",
        navigation: true,
    };
    $.fn.mauGallery.listeners = function (options) {
        $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);

        $(".gallery-item").on("click", function () {
            if (options.lightBox && $(this).prop("tagName") === "IMG") {
                $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
            } else {
                return;
            }
        });

        $(".gallery-item").on("keydown", function (event) {
            if (event.key === "Enter") {
                $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
            }
        });

        $(".gallery").on("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                $.fn.mauGallery.methods.prevImage(options.lightboxId);
            }
        });

        $(".gallery").on("keydown", (event) => {
            if (event.key === "ArrowRight") {
                $.fn.mauGallery.methods.nextImage(options.lightboxId);
            }
        });

        $(".gallery").on("click", ".mg-prev", () => {
            $.fn.mauGallery.methods.prevImage(options.lightboxId);
        });

        $(".gallery").on("click", ".mg-next", () => {
            $.fn.mauGallery.methods.nextImage(options.lightboxId);
        });
    };
    $.fn.mauGallery.methods = {
        createRowWrapper(element) {
            if (!element.children().first().hasClass("row")) {
                element.append('<div class="gallery-items-row row"></div>');
            }
        },
        
        wrapItemInColumn(element, columns) {
            if (columns.constructor === Number) {
                element.wrap(`<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`);
            } else if (columns.constructor === Object) {
                var columnClasses = "";
                if (columns.xs) {
                    columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
                }
                if (columns.sm) {
                    columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
                }
                if (columns.md) {
                    columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
                }
                if (columns.lg) {
                    columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
                }
                if (columns.xl) {
                    columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
                }
                element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
            } else {
                console.error(`Columns should be defined as numbers or objects. ${typeof columns} is not supported.`);
            }
        },

        moveItemInRowWrapper(element) {
            element.appendTo(".gallery-items-row");
        },

        responsiveImageItem(element) {
            if (element.prop("tagName") === "IMG") {
                element.addClass("img-fluid");
            }
        },

        openLightBox(element, lightboxId) {
            $(`#${lightboxId}`).find(".lightboxImage").attr("src", element.attr("src")).attr("alt", element.attr("alt"));
            $(`#${lightboxId}`).modal("toggle");
        },

        prevImage() {
            let activeImage = null;
            $("img.gallery-item").each(function () {
                if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
                    activeImage = $(this);
                }
            });
            let activeTag = $(".tags-bar button.active-tag").data("images-toggle");
            let imagesCollection = [];
            if (activeTag === "Tous") {
                $(".item-column").each(function () {
                    if ($(this).children("img").length) {
                        imagesCollection.push($(this).children("img"));
                    }
                });
            } else {
                $(".item-column").each(function () {
                    if ($(this).children("img").data("gallery-tag") === activeTag) {
                        imagesCollection.push($(this).children("img"));
                    }
                });
            }
            let index = 0,
                next = null;

            $(imagesCollection).each(function (i) {
                if ($(activeImage).attr("src") === $(this).attr("src")) {
                    index = i - 1;
                }
            });
            next = imagesCollection[index] || imagesCollection[imagesCollection.length - 1];
            $(".lightboxImage").attr("src", $(next).attr("src")).attr("alt", $(next).attr("alt"));
        },

        nextImage() {
            let activeImage = null;
            $("img.gallery-item").each(function () {
                if ($(this).attr("src") === $(".lightboxImage").attr("src")) {
                    activeImage = $(this);
                }
            });
            let activeTag = $(".tags-bar button.active-tag").data("images-toggle");
            let imagesCollection = [];
            if (activeTag === "Tous") {
                $(".item-column").each(function () {
                    if ($(this).children("img").length) {
                        imagesCollection.push($(this).children("img"));
                    }
                });
            } else {
                $(".item-column").each(function () {
                    if ($(this).children("img").data("gallery-tag") === activeTag) {
                        imagesCollection.push($(this).children("img"));
                    }
                });
            }
            let index = 0,
                next = null;

            $(imagesCollection).each(function (i) {
                if ($(activeImage).attr("src") === $(this).attr("src")) {
                    index = i + 1;
                }
            });
            next = imagesCollection[index] || imagesCollection[0];
            $(".lightboxImage").attr("src", $(next).attr("src")).attr("alt", $(next).attr("alt"));
        },
        createLightBox(gallery, lightboxId, navigation) {
            gallery.append(`<div class="modal fade" id="${
                lightboxId ? lightboxId : "galleryLightbox"
            }" tabindex="-1" role="dialog" aria-label="lightbox modal" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            ${
                                navigation
                                    ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                    : '<span style="display:none;" />'
                            }
                            <img class="lightboxImage img-fluid" alt="image not loaded"/>
                            ${
                                navigation
                                    ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
                                    : '<span style="display:none;" />'
                            }
                        </div>
                    </div>
                </div>
            </div>`);
        },

        showItemTags(gallery, position, tags) {
            var tagItems =
                '<li class="nav-item"><button type="button" class="nav-link active active-tag" href="#" data-images-toggle="Tous">Tous</button></li>';
            $.each(tags, function (index, value) {
                tagItems += `<li class="nav-item active">
                <button type="button" class="nav-link" href="#" data-images-toggle="${value}">${value}</button></li>`;
            });
            var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

            if (position === "bottom") {
                gallery.append(tagsRow);
            } else if (position === "top") {
                gallery.prepend(tagsRow);
            } else {
                console.error(`Unknown tags position: ${position}`);
            }
        },

        filterByTag() {
            if ($(this).hasClass("active-tag")) {
                return;
            }
            $(".active.active-tag").removeClass("active active-tag");
            $(this).addClass("active-tag active");

            var tag = $(this).data("images-toggle");

            function hiden(element) {
                element.style.display = "none";
            }

            function shown(element, duration) {
                const screenWidth = window.innerWidth;
                const mappedScreenWidth = Math.max(34, 100 - (screenWidth - 600) * 0.15);
                element.style.display = "";
                element.style.opacity = 0;
                element.style.maxWidth = "0px";

                // Set the final styles after a delay to allow the transition to occur
                setTimeout(() => {
                    element.style.transition = `opacity ${duration}ms ease-in-out, max-width ${duration}ms ease-in-out`;
                    element.style.opacity = 1;
                    element.style.maxWidth = `${mappedScreenWidth}%`;
                    setTimeout(() => {
                        element.style.transition = "none";
                        element.style.maxWidth = "100%";
                    }, duration + 100);
                }, 10);
            }

            $(".gallery-item").each(function () {
                const itemColumn = $(this).parents(".item-column");
                hiden(itemColumn[0]);
                if (tag === "Tous" || $(this).data("gallery-tag") === tag) {
                    shown(itemColumn[0], 300);
                }
            });
        },
    };
})(jQuery);
