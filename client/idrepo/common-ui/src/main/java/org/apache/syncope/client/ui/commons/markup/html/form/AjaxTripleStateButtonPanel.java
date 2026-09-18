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
package org.apache.syncope.client.ui.commons.markup.html.form;

import java.io.Serializable;
import java.util.List;
import java.util.Optional;
import java.util.function.Predicate;
import org.apache.commons.lang3.StringUtils;
import org.apache.syncope.common.lib.Attr;
import org.apache.syncope.common.lib.to.AttributableTO;
import org.apache.wicket.AttributeModifier;
import org.apache.wicket.ajax.AjaxRequestTarget;
import org.apache.wicket.ajax.form.AjaxFormChoiceComponentUpdatingBehavior;
import org.apache.wicket.markup.html.WebMarkupContainer;
import org.apache.wicket.markup.html.form.Radio;
import org.apache.wicket.markup.html.form.RadioGroup;
import org.apache.wicket.markup.html.list.ListItem;
import org.apache.wicket.model.IModel;
import org.apache.wicket.model.Model;
import org.apache.wicket.model.ResourceModel;

public class AjaxTripleStateButtonPanel extends FieldPanel<Boolean> {

    private static final long serialVersionUID = 5433965057104106773L;

    protected final WebMarkupContainer unsetContainer;

    protected final Radio<Boolean> unsetOption;

    public AjaxTripleStateButtonPanel(final String id, final String name, final IModel<Boolean> model) {
        this(id, name, model, true);
    }

    public AjaxTripleStateButtonPanel(
            final String id,
            final String name,
            final IModel<Boolean> model,
            final boolean enableOnChange) {

        super(id, name, model);

        field = new RadioGroup<>("tripleStateField", model);
        add(field.setLabel(new ResourceModel(name, name)).setOutputMarkupId(true));

        Radio<Boolean> trueOption = new Radio<>("trueOption", Model.of(Boolean.TRUE));
        Radio<Boolean> falseOption = new Radio<>("falseOption", Model.of(Boolean.FALSE));
        field.add(trueOption.setOutputMarkupId(true), falseOption.setOutputMarkupId(true));

        WebMarkupContainer trueLabel = new WebMarkupContainer("trueLabel");
        trueLabel.add(AttributeModifier.replace("for", trueOption.getMarkupId()));
        field.add(trueLabel);

        WebMarkupContainer falseLabel = new WebMarkupContainer("falseLabel");
        falseLabel.add(AttributeModifier.replace("for", falseOption.getMarkupId()));
        field.add(falseLabel);

        unsetContainer = new WebMarkupContainer("unsetContainer");
        field.add(unsetContainer);

        unsetOption = new Radio<>("unsetOption", Model.of((Boolean) null));
        unsetContainer.add(unsetOption.setOutputMarkupId(true));

        WebMarkupContainer unsetLabel = new WebMarkupContainer("unsetLabel");
        unsetLabel.add(AttributeModifier.replace("for", unsetOption.getMarkupId()));
        unsetContainer.add(unsetLabel);

        if (enableOnChange && !isReadOnly()) {
            field.add(new AjaxFormChoiceComponentUpdatingBehavior() {

                private static final long serialVersionUID = -8888833255711609077L;

                @Override
                protected void onUpdate(final AjaxRequestTarget target) {
                    doUpdate(target);
                }
            });
        }
    }

    private static Boolean parseTriState(final String value) {
        if (value != null) {
            if (Boolean.TRUE.toString().equalsIgnoreCase(value)) {
                return Boolean.TRUE;
            }
            if (Boolean.FALSE.toString().equalsIgnoreCase(value)) {
                return Boolean.FALSE;
            }
        }
        return null;
    }

    protected Boolean getRequiredDefaultValue() {
        return Boolean.FALSE;
    }

    protected void configureUnsetOption(final boolean required) {
        unsetContainer.setVisible(!required);
        unsetOption.setEnabled(!required);
    }

    protected void doUpdate(final AjaxRequestTarget target) {
        // nothing to do
    }

    @Override
    public FieldPanel<Boolean> setRequired(final boolean required) {
        configureUnsetOption(required);

        if (required && field.getDefaultModelObject() == null) {
            field.setDefaultModelObject(getRequiredDefaultValue());
        }

        return super.setRequired(required);
    }

    @Override
    public FieldPanel<Boolean> setNewModel(final List<Serializable> list) {
        setNewModel(new Model<>() {

            private static final long serialVersionUID = 527651414610325237L;

            @Override
            public Boolean getObject() {
                if (list == null || list.isEmpty()) {
                    return null;
                }

                return parseTriState(list.getFirst().toString());
            }

            @Override
            public void setObject(final Boolean object) {
                list.clear();
                if (object != null) {
                    list.add(object.toString());
                }
            }
        });

        return this;
    }

    @Override
    @SuppressWarnings("rawtypes")
    public FieldPanel<Boolean> setNewModel(final ListItem item) {
        IModel<Boolean> model = new Model<>() {

            private static final long serialVersionUID = 6799404673615637845L;

            @Override
            public Boolean getObject() {
                final Object obj = item.getModelObject();

                if (obj instanceof Boolean b) {
                    return b;
                }

                return parseTriState(obj.toString());
            }

            @Override
            @SuppressWarnings("unchecked")
            public void setObject(final Boolean object) {
                item.setModelObject(Optional.ofNullable(object).map(Object::toString).orElse(StringUtils.EMPTY));
            }
        };

        field.setModel(model);
        return this;
    }

    @Override
    @SuppressWarnings({"rawtypes", "unchecked"})
    public FieldPanel<Boolean> setNewModel(final AttributableTO attributable, final String schema) {
        field.setModel(new Model() {

            private static final long serialVersionUID = -4214654722524358000L;

            @Override
            public Serializable getObject() {
                return attributable.getPlainAttr(schema).map(Attr::getValues).filter(Predicate.not(List::isEmpty)).
                        map(values -> parseTriState(values.getFirst())).
                        orElse(null);
            }

            @Override
            public void setObject(final Serializable object) {
                attributable.getPlainAttr(schema).ifPresent(plainAttr -> {
                    plainAttr.getValues().clear();
                    if (object != null) {
                        plainAttr.getValues().add(object.toString());
                    }
                });
            }
        });

        return this;
    }
}
