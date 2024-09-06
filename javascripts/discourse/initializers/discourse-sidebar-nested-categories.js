import { withPluginApi } from "discourse/lib/plugin-api";
import Category from "discourse/models/category";
import I18n from "I18n";

export default {
  name: "custom-categories-section",
  initialize(container) {
    withPluginApi("1.3.0", (api) => {
      api.addSidebarSection(
        (BaseCustomSidebarSection, BaseCustomSidebarSectionLink) => {
          const CustomCategoriesSectionLink = class extends BaseCustomSidebarSectionLink {
            constructor({ category }) {
              super(...arguments);
              this.category = category;
            }

            get name() {
              return this.category.parentCategory ? `subcategory` : `category`;
            }

            get classNames() {
              return this.category.parentCategory
                ? `subcategory-${this.category.slug}`
                : `category-${this.category.slug}`;
            }

            get route() {
              return "discovery.category";
            }

            get model() {
              return `${Category.slugFor(this.category)}/${this.category.id}`;
            }

            get text() {
              return this.category.name;
            }

            get prefixBadge() {
              return this.category.read_restricted ? "lock" : null;
            }

            get prefixType() {
              return "span";
            }

            get prefixValue() {
              if (this.category.parentCategory?.color) {
                return [
                  this.category.parentCategory?.color,
                  this.category.color,
                ];
              } else {
                return [this.category.color];
              }
            }

            get prefixColor() {
              return this.category.color;
            }

            get title() {
              return this.category.description;
            }
          };

          const CustomCategoriesSection = class extends BaseCustomSidebarSection {
            constructor() {
              super(...arguments);

              if (container.isDestroyed) {
                return;
              }

              this.site = container.lookup("service:site");
              this.categories = this.site.categories;
            }

            get sectionLinks() {
              return this.categories.map(
                (category) =>
                  new CustomCategoriesSectionLink({
                    category,
                  })
              );
            }

            get name() {
              return I18n.t("filters.categories.title");
            }

            get text() {
              return I18n.t("filters.categories.title");
            }

            get links() {
              return this.sectionLinks;
            }

            get displaySection() {
              return this.sectionLinks?.length > 0;
            }
          };

          return CustomCategoriesSection;
        }
      );
    });
  },
};
