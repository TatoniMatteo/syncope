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
package org.apache.syncope.core.persistence.common.validation;

import jakarta.validation.ConstraintValidatorContext;
import java.util.Set;
import org.apache.syncope.common.lib.types.AnyTypeKind;
import org.apache.syncope.common.lib.types.EntityViolationType;
import org.apache.syncope.core.persistence.api.entity.RelationshipType;
import org.apache.syncope.core.persistence.common.entity.AMembershipType;
import org.apache.syncope.core.persistence.common.entity.UMembershipType;

public class RelationshipTypeValidator extends AbstractValidator<RelationshipTypeCheck, RelationshipType> {

    private static final Set<String> INVALID_KEYS = Set.of(
            UMembershipType.KEY,
            AMembershipType.KEY,
            "membership");

    @Override
    public boolean isValid(final RelationshipType relationshipType, final ConstraintValidatorContext context) {
        context.disableDefaultConstraintViolation();

        boolean isValid = true;

        if (isHtml(relationshipType.getKey())) {
            context.buildConstraintViolationWithTemplate(
                    getTemplate(EntityViolationType.InvalidKey, relationshipType.getKey())).
                    addPropertyNode("key").addConstraintViolation();

            isValid = false;
        }

        if (INVALID_KEYS.stream().anyMatch(k -> k.equalsIgnoreCase(relationshipType.getKey()))) {
            context.buildConstraintViolationWithTemplate(
                    getTemplate(EntityViolationType.InvalidKey, relationshipType.getKey())).
                    addPropertyNode("key").addConstraintViolation();

            isValid = false;
        }

        if (relationshipType.getRightEndAnyType() != null
                && relationshipType.getRightEndAnyType().getKind() != AnyTypeKind.ANY_OBJECT) {

            context.buildConstraintViolationWithTemplate(
                    getTemplate(EntityViolationType.InvalidAnyType,
                            relationshipType.getRightEndAnyType().getKind().name())).
                    addPropertyNode("rightEndAnyType").addConstraintViolation();

            isValid = false;
        }

        return isValid;
    }
}
